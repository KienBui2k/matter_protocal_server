import { OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { emit } from 'process';
import { async } from 'rxjs';
import { Server, Socket } from 'socket.io';
// import { Socket } from 'socket.io-client';
import { getCommand, Command } from 'src/enum';
import { Device } from 'src/modules/devices/entities/device.entity';
import { Repository } from 'typeorm';

interface deviceType {
  decodedData: string;
}
@WebSocketGateway(3001, { cors: true })
export class DeviceSocket implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private devices: deviceType[] = [];

  constructor(
     @InjectRepository(Device) private readonly Devices: Repository<Device>,
  ) {}

  onModuleInit() {
    this.server.on('connect', async (socket: Socket) => {
      socket.on(
        'requireDecoe',
        (data: { message: number; node_id: number; }) => {
          // data dau vao cua connect
            this.socketModule(socket, data.message, data.node_id);
          // socket.emit("test", {
          //   decode:"huahfae"
          // })
        },
      );
      socket.on('unpairDevice',async (data:{message:number,id:string,node_id:number }) => {
        this.socketModule(socket,data.message,data.node_id)
          // let device = await 
          this.unpair(socket,data.id)
      })

      //  socket.emit("requireDecoe", {
      //     decode:"huahfae"
      //   })
    });
  }
  async socketModule(socket: Socket,message: number, node_id: number) {
    const WebSocket = require('ws');
    const serverUrl = 'ws://21.240.175.42:5580/ws';
    const socketIo = new WebSocket(serverUrl);

    const param = getCommand(String(message), {
      node_id: node_id,
    });

    // let testdecoe = 'abc';
    // socket.emit('decode', "ehfbehvwjn");

    console.log('param', param);

    await socketIo.on('open', async () => {
      console.log('Connected to WebSocket gateway');
      socketIo.send(JSON.stringify(param));
    });
    let jsonData;

    socketIo.on('message', (message) => {
      const bufferdata = Buffer.from(message);
      try {
        jsonData = JSON.parse(bufferdata.toString());
        console.log("jsonData",jsonData);
        
        if (jsonData?.message_id ) {
          if (jsonData?.result && jsonData?.message_id == 8) {
            const decodedData = Buffer.from(
              jsonData?.result[1],
              'base64',
            ).toString('utf-8');
            socket.emit('decode', decodedData);
            this.devices.push({
              decodedData,
            });
          } else if(jsonData?.message_id == 7 && jsonData?.result == null){
            socket.emit('unpairSucces',"Đã ngắt kết nối với thiết bị!")
          }else

          {
            console.log('Lỗi', jsonData);
            if(jsonData.error_code == 5){
              socket.emit('unpairFailed', "Không tìm thấy thấy thiết bị cần ngắt kết nối.");
            }else if(jsonData.error_code == 7){
              socket.emit('decodeFailed', "Đã có lỗi trong quá trình tìm kiếm mã kết nối, vui lòng thử lại sau!");
            }else if(jsonData.error_code == 0){
              socket.emit('pairFailed', "Mã kết nối không hợp lệ, vui lòng thử lại sau!.");
            }
            // else if(){

            // }
          }
        }
      } catch (error) {
        console.error('Lỗi khi giải mã JSON:', error);
         socket.emit('socketFailed', "Lỗi hệ thống, vui lòng thử lại sau!");
      }
    });

    socketIo.on('error', (error) => {
      console.error('Lỗi kết nối:', error);
    });

    socketIo.on('close', (code, reason) => {
      console.log('Kết nối đã đóng:', code, reason);
    });
  }
  async unpair(socket:Socket,id:string | null){
  try {
    if(id == null)return false;
    let devieDelete = await this.Devices.delete({id:id})
    console.log("devieDelete",devieDelete);
    return
  } catch (err) {
    return false;
  }
  }
}

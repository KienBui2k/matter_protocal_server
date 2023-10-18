import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { async } from 'rxjs';
import { Server, Socket } from 'socket.io';
// import { Socket } from 'socket.io-client';
import { getCommand, Command } from 'src/enum';

interface deviceType {
  decodedData: string;
}
@WebSocketGateway(3001, { cors: true })
export class DeviceSocket implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private devices: deviceType[] = [];

  constructor() {}

  onModuleInit() {
    this.server.on('connect', async (socket: Socket) => {
      socket.on(
        'requireDecoe',
        (data: { message: number; node_id: number }) => {
          // data dau vao cua connect
            this.socketModule(socket, data.message, data.node_id);
          // socket.emit("test", {
          //   decode:"huahfae"
          // })
        },
      );

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
        if (jsonData?.message_id) {
          if (jsonData?.result) {
            const decodedData = Buffer.from(
              jsonData?.result[1],
              'base64',
            ).toString('utf-8');
            socket.emit('decode', decodedData);
            this.devices.push({
              decodedData,
            });
          } else {
            console.log('Lỗi', jsonData);
              socket.emit('decodeFailed', "Đã có lỗi trong quá trình tìm kiếm mã kết nối, vui lòng thử lại sau!");
          }
        }
      } catch (error) {
        console.error('Lỗi khi giải mã JSON:', error);
         socket.emit('decodeFailed', "Đã có lỗi trong quá trình tìm kiếm mã kết nối, vui lòng thử lại sau!");
      }
    });

    socketIo.on('error', (error) => {
      console.error('Lỗi kết nối:', error);
    });

    socketIo.on('close', (code, reason) => {
      console.log('Kết nối đã đóng:', code, reason);
    });
  }
}

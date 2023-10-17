import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { async } from 'rxjs';
import { Server } from 'socket.io';
import { getCommand,Command } from 'src/enum';
import WebSocket from 'ws';
interface deviceType {
  decodedData:string;
}
@WebSocketGateway()
export class DeviceSocket implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  private devices: deviceType[] = [];
  constructor() {}
  async onModuleInit() {
    
    this.socketModule(8, 156); 

  }
  async socketModule(message: number, mode_id: number) {
    const WebSocket = require('ws');
    const serverUrl = 'ws://21.240.175.42:5580/ws';
    const socket = new WebSocket(serverUrl);


    const param = getCommand(String(message),{
      "node_id":mode_id
    })


    console.log("param",param);
    await socket.on('open', async () => {
      console.log("Connected to WebSocket gateway");
      socket.send(JSON.stringify(param))
      
    })
    let jsonData;

    socket.on('message', (message) => {
    
      const bufferdata = Buffer.from(message);
        
      try {
        console.log("test",message);
        
        jsonData = JSON.parse(bufferdata.toString());
        console.log("jsonData",jsonData);
        
          if (jsonData?.message_id) {
            if (jsonData?.result) {
              const decodedData = Buffer.from(jsonData?.result[1], 'base64').toString('utf-8');
              console.log('jsonData?.result', jsonData);
              console.log('jsonData?.result', decodedData);
              this.devices.push({
                decodedData,
              });
              console.log('devices', this.devices);
            } else {
              console.log('Lỗi', jsonData);
            }
          }else{
            console.log("111");
            
          }
      } catch (error) {
        console.error('Lỗi khi giải mã JSON:', error);
      }
    });

    socket.on('error', (error) => {
      console.error('Lỗi kết nối:', error);
    });

    socket.on('close', (code, reason) => {
      console.log('Kết nối đã đóng:', code, reason);
    });
  }
  // async handleParam(message :number) => {
    
  // }
}
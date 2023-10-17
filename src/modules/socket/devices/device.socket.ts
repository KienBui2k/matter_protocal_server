// import { Inject, OnModuleInit } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Device } from 'src/modules/devices/entities/device.entity';
// import { JwtService } from 'src/modules/jwt/jwt.service';
//  import * as io from 'socket.io-client';
// // import io from 'socket.io-client'
// interface deviceType {
//     device: Device;
//     socket:Socket;
// }
// const serverUrl = 'http://127.0.0.1:5508';
// const socket = io(serverUrl);

// @WebSocketGateway(parseInt(process.env.MCS_PORT), { cors: true })
// export class DeviceSocketGateway implements OnModuleInit {

//     @WebSocketServer()
//     server: Server; 
//     divices: deviceType[] = [];
//     constructor(
//         private readonly jwt: JwtService,
//         @Inject('MCS_HOST') private readonly mcsHost: string,

//     ){}
//    onModuleInit() {
// socket.on('connect', () => {
//   console.log('Connected to WebSocket server');
// });

// socket.on('message', (data) => {
//   console.log('Received message:', data);
// });
// socket.emit('message', 'Hello from WebSocket client');
//         // this.server.on("connect", async (socket: Socket) => {
//         //     console.log(`Device connected to ${this.mcsHost}:${process.env.MCS_PORT}`);
//         // });

//     }
// }

// import { Inject, OnModuleInit } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Device } from 'src/modules/devices/entities/device.entity';
// import { JwtService } from 'src/modules/jwt/jwt.service';
// // import * as io from 'socket.io-client';
// import { io } from 'socket.io-client';
// interface deviceType {
//   device: Device;
//   socket: Socket;
// }

// @WebSocketGateway(parseInt(process.env.MCS_PORT), { cors: true })
// export class DeviceSocketGateway implements OnModuleInit {
//   @WebSocketServer()
//   server: Server;
//   devices: deviceType[] = [];



//   constructor(
//     private readonly jwt: JwtService,
//     @Inject('MCS_HOST') private readonly mcsHost: string,

//   ) { }

  // onModuleInit() {


    // const serverUrl = 'http://127.0.0.1:5508';
    // const socket = io(serverUrl);
    //   const WebSocket = require('ws');
    //   const serverUrl = 'ws://21.240.175.42:5580/ws';

    //   // Tạo kết nối WebSocket
    //   const socket = new WebSocket(serverUrl);

    //   // Sự kiện khi kết nối thành công
    //   socket.on('open', () => {
    //     console.log('Đã kết nối vào WebSocket gateway.');

    //     const message = {
    //       message_id: "2",
    //       command: "open_commissioning_window",
    //       args: {
    //         "node_id": 156
    //       }
    //     }
    //     socket.send(JSON.stringify(message));
    //   });

    //   // Sự kiện khi nhận tin nhắn từ server
    //   socket.on('message', (message) => {
    //     const bufferdata = Buffer.from(message);
    //     let jsonData;

    //     try {
    //       jsonData = JSON.parse(bufferdata.toString());
    //       console.log('Nhận tin nhắn từ server:', jsonData);
    //     } catch (error) {
    //       console.error('Lỗi khi giải mã JSON:', error);
    //     }
    //   });



    //   // Sự kiện khi có lỗi
    //   socket.on('error', (error) => {
    //     console.error('Lỗi kết nối:', error);
    //   });

    //   // Sự kiện khi đóng kết nối
    //   socket.on('close', (code, reason) => {
    //     console.log('Kết nối đã đóng:', code, reason);
    //   });
    //   socket.on('connect', () => {
    //     console.log('Connected to WebSocket server');
    //   });

    //   socket.on('message', (data) => {
    //     console.log('Received message:', data);
    //   });

    //   socket.emit('message', 'Hello from WebSocket client');
    // }
//   }

// }
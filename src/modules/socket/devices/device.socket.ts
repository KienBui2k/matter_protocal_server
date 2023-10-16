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

import { Inject, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Device } from 'src/modules/devices/entities/device.entity';
import { JwtService } from 'src/modules/jwt/jwt.service';
// import * as io from 'socket.io-client';
import { io } from 'socket.io-client';
interface deviceType {
  device: Device;
  socket: Socket;
}

@WebSocketGateway(parseInt(process.env.MCS_PORT), { cors: true })
export class DeviceSocketGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;
  devices: deviceType[] = [];

  constructor(
    private readonly jwt: JwtService,
    @Inject('MCS_HOST') private readonly mcsHost: string,
  ) {}

  onModuleInit() {
    const serverUrl = 'http://127.0.0.1:5508';
    const socket = io(serverUrl);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
    });

    socket.emit('message', 'Hello from WebSocket client');
  }
}


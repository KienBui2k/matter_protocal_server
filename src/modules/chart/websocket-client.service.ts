// import { Injectable } from '@nestjs/common';
// import { io, Socket } from 'socket.io-client';
// import { Observable } from 'rxjs';

// @Injectable()
// export class WebSocketClientService {
//     private socket: Socket;

//     constructor() {
//         this.socket = io('ws://21.240.175.42:5580/ws');


//     }

//     startListening(): Observable<boolean> {
//         return new Observable<boolean>((observer) => {
//             // console.log("vào 2123", observer);
//             console.log("socket", this.socket);
//             this.socket.emit('start_listening', { message_id: '3', command: 'start_listening' });

//             this.socket.on('listening_result', (data: boolean) => {
//                 console.log("data", data);

//                 observer.next(data);
//             });
//         });
//     }
// }


// device-usage.controller.ts

// device-usage.service.ts

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { DeviceUsage } from './entities/chart.entity';

// @Injectable()
// export class DeviceUsageService {
//     constructor(
//         @InjectRepository(DeviceUsage)
//         private readonly deviceUsageRepository: Repository<DeviceUsage>,
//     ) { }

//     async addDeviceUsage(deviceId: string, isDeviceOn: boolean): Promise<DeviceUsage> {
//         const deviceUsage = new DeviceUsage();
//         deviceUsage.deviceId = deviceId;
//         deviceUsage.isDeviceOn = isDeviceOn;

//         return this.deviceUsageRepository.save(deviceUsage);
//     }

//     async getDeviceUsageHistory(deviceId: string): Promise<DeviceUsage[]> {
//         return this.deviceUsageRepository.find({ where: { deviceId }, order: { timestamp: 'DESC' } });
//     }
// }

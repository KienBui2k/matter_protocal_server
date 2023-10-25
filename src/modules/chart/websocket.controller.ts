// import { Controller, Get } from '@nestjs/common';
// import { WebSocketClientService } from './websocket-client.service';

// @Controller('websocket')
// export class WebSocketController {
//     constructor(private readonly websocketClientService: WebSocketClientService) { }

//     @Get('start-listening')
//     async startListening(): Promise<boolean> {
//         console.log("vào");

//         return this.websocketClientService.startListening().toPromise();
//     }
// }
// import { Controller, Post, Get, Param, Body } from '@nestjs/common';
// import { DeviceUsage } from './entities/chart.entity';
// import { DeviceUsageService } from './websocket-client.service';

// @Controller('device-usage')
// export class DeviceUsageController {
//     constructor(private readonly deviceUsageService: DeviceUsageService) { }

//     @Post(':deviceId/:isDeviceOn')
//     addDeviceUsage(
//         @Param('deviceId') deviceId: string,
//         @Param('isDeviceOn') isDeviceOn: boolean,
//     ) {
//         return this.deviceUsageService.addDeviceUsage(deviceId, isDeviceOn);
//     }

//     @Get(':deviceId/history')
//     getDeviceUsageHistory(@Param('deviceId') deviceId: string) {
//         return this.deviceUsageService.getDeviceUsageHistory(deviceId);
//     }
// }

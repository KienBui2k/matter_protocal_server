import { Module } from '@nestjs/common';
import { DeviceSocket } from './devices/device.socket'; 

@Module({
  providers: [DeviceSocket],
})
export class SocketModule {}
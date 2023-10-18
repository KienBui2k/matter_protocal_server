import { Module } from '@nestjs/common';
import { DeviceSocket } from './devices/device.socket';
import { JwtService } from '../jwt/jwt.service';
import { UserSocketGateway } from './users/users.socket';

@Module({
  providers: [DeviceSocket, JwtService, UserSocketGateway],
})
export class SocketModule { }
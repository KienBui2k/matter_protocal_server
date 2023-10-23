import { Module } from '@nestjs/common';
import { DeviceSocket } from './devices/device.socket';
import { JwtService } from '../jwt/jwt.service';
import { UserSocketGateway } from './users/users.socket';
import { Device } from '../devices/entities/device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevive } from '../user_devive/entities/user_devive.entity';
import { DeviceModule } from '../devices/device.module';
@Module({
      imports: [
        TypeOrmModule.forFeature([Device,UserDevive])
    ],
  providers: [DeviceSocket, JwtService, UserSocketGateway,DeviceModule],
})
export class SocketModule { }
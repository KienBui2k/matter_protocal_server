import { Module } from '@nestjs/common';
import { DeviceSocket } from './devices/device.socket';
import { JwtService } from '../jwt/jwt.service';
import { UserSocketGateway } from './users/users.socket';
import { Device } from '../devices/entities/device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartSocketGateway } from './chart/chart.socket';
import { UserDevice } from '../user_devive/entities/user_devive.entity';
import { User } from '../users/entities/user.entity';
import { Chart } from '../chart/entities/chart.entity';
import { AddDeviceSocketGateway } from './addDevices/addDevices';
@Module({
  imports: [
    TypeOrmModule.forFeature([Device, UserDevice, User, Chart])
  ],
  providers: [DeviceSocket, JwtService, UserSocketGateway, ChartSocketGateway, AddDeviceSocketGateway],
})
export class SocketModule { }
import { Module } from '@nestjs/common';
import { UserDeviveService } from './user_devive.service';
import { UserDeviveController } from './user_devive.controller';

@Module({
  controllers: [UserDeviveController],
  providers: [UserDeviveService],
})
export class UserDeviveModule {}

import { Module } from '@nestjs/common';
import { UserDeviveService } from './user_devive.service';
import { UserDeviveController } from './user_devive.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserDevive } from './entities/user_devive.entity';

@Module({
  // imports: [TypeOrmModule.forFeature([UserDevive])],
  controllers: [UserDeviveController],
  providers: [UserDeviveService],
})
export class UserDeviveModule { }

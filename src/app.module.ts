import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceModule } from './modules/device/device.module';
import { UserDeviveModule } from './modules/user_devive/user_devive.module';
import { BindingModule } from './modules/binding/binding.module';
import { AuthenModule } from './modules/authen/authen.module';
@Module({
       
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DBNAME,
     entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UsersModule,
    DeviceModule,
    UserDeviveModule,
    BindingModule,
    AuthenModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

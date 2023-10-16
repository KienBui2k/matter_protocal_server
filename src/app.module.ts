import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
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
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

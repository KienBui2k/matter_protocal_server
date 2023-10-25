import { Body, Injectable, Res } from '@nestjs/common';
import { CreateUserDeviveDto } from './dto/create-user_devive.dto';
import { UpdateUserDeviveDto } from './dto/update-user_devive.dto';
import  { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDevive } from './entities/user_devive.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserDeviveService {
    constructor(
    @InjectRepository(UserDevive) private products: Repository<UserDevive>,
  ) {}
  async create(createUserDeviveDto: CreateUserDeviveDto) {
    try {
      let  newUserDeviveService = new UserDevive();
      // newUserDeviveService.user_id = createUserDeviveDto.user_id;
      console.log("newUserDeviveService",newUserDeviveService);      
    } catch (err) {
      console.log('err', err.code);
      return {
        message: 'lỗi hệ thống, vui lòng thử lại sau!',
        status: false,
        data: null,
      };
    }
  }

}

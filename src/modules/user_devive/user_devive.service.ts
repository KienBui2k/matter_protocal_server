import { Injectable } from '@nestjs/common';
import { CreateUserDeviveDto } from './dto/create-user_devive.dto';
import { UpdateUserDeviveDto } from './dto/update-user_devive.dto';

@Injectable()
export class UserDeviveService {
  create(createUserDeviveDto: CreateUserDeviveDto) {
    return 'This action adds a new userDevive';
  }

  findAll() {
    return `This action returns all userDevive`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userDevive`;
  }

  update(id: number, updateUserDeviveDto: UpdateUserDeviveDto) {
    return `This action updates a #${id} userDevive`;
  }

  remove(id: number) {
    return `This action removes a #${id} userDevive`;
  }
}

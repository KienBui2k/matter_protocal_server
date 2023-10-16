import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '../jwt/jwt.service';
import { User } from './entities/user.entity';
import { FindByIdSerRes } from './users.interface';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private users: Repository<User>, private jwtService: JwtService) { }

  async register(CreateUserDto: CreateUserDto) {
    try {
      console.log("CreateUserDto", CreateUserDto);

      let newUser = this.users.create(CreateUserDto);
      let result = await this.users.save(newUser);

      return {
        status: true,
        message: "Register good!",
        data: result
      }

    } catch (err) {
      console.log("err", err);

      return {
        status: false,
        message: "Lỗi model",
        data: null
      }
    }
  }
  async findById(userId: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.users.findOne({
        where: {
          id: userId
        }
      })
      if (!result) {
        throw new Error
      }
      return {
        status: true,
        data: result,
        message: "findById good!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }
  // async test(userId: string): Promise<FindByIdSerRes> {
  //   try {
  //     let result = await this.users.findOne({
  //       where: {
  //         id: userId
  //       }
  //     })
  //     if (!result) {
  //       throw new Error
  //     }
  //     return {
  //       status: true,
  //       data: result,
  //       message: "findById good!"
  //     }
  //   } catch (err) {
  //     return {
  //       status: false,
  //       data: null,
  //       message: "Lỗi model"
  //     }
  //   }
  // }

}

import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { MailService, templates } from '../mail/mail.service';
import { JwtService } from '../jwt/jwt.service';
import { Response, Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly mail: MailService, private readonly jwt: JwtService) { }

  @Post()
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      console.log("createUserDto", createUserDto);

      let serRes = await this.usersService.register(createUserDto);

      if (serRes.status) {
        /* Mail */
        this.mail.sendMail({
          subject: "Register Authentication Email",
          to: serRes.data.email,
          html: templates.emailConfirm({
            confirmLink: `${process.env.HOST}:${process.env.PORT}/api/v1/user/email-authentication/${serRes.data.id}/${this.jwt.createToken(serRes.data, "300000")}`,
            language: "vi",
            productName: "PS5",
            productWebUrl: "PS5.com",
            receiverName: `${serRes.data.userName}`
          })
        })
        ///console.log("check", check, serRes.data.email)
      }


      return res.status(serRes.status ? 200 : 213).json(serRes);
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }


  // @Get()
  // async test(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
  //   try {
  //     console.log("createUserDto", createUserDto);
  //     const decodedData = Buffer.from("TVQ6MDAwMDBDUU0wMFEuQ1I1RDEyMA==", 'base64').toString('utf-8');
  //     console.log("decodedData", decodedData);


  //     return decodedData

  //   } catch (err) {
  //     return res.status(500).json({
  //       message: "Server Controller Error!"
  //     });
  //   }
  // }
}

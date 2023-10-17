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
    
      }


      return res.status(serRes.status ? 200 : 213).json(serRes);
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  
  @Get('email-authentication/:userId/:token')
  async emailAuthentication(@Param('userId') userId: string, @Param('token') token: string, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(token);
      let serResUser = await this.usersService.findById(userId);
      if (serResUser.status && userDecode) {
        if (serResUser.data.updateAt == userDecode.updateAt) {
          if (!serResUser.data.emailAuthentication) {
            let serRes = await this.usersService.update(userId, {
              emailAuthentication: true
            });
            console.log("serRes", serRes)
            if (serRes.status) {
              this.mail.sendMail({
                subject: "Authentication Email Notice",
                to: serRes.data.email,
                text: `Email đã được liên kết với tài khoản ${serRes.data.userName}`
              })
            }

            return res.status(serRes.status ? 200 : 213).send(serRes.status ? "ok" : "fail");
          } else {
            return res.status(213).send("Tài khoản đã kích hoạt email!");
          }
        }
      }
      return res.status(213).send("Email đã hết hạn!");
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

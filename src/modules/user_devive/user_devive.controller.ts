import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserDeviveService } from './user_devive.service';
import { CreateUserDeviveDto } from './dto/create-user_devive.dto';
import { UpdateUserDeviveDto } from './dto/update-user_devive.dto';

@Controller('user-devive')
export class UserDeviveController {
  constructor(private readonly userDeviveService: UserDeviveService) {}

  @Post()
  create(@Body() createUserDeviveDto: CreateUserDeviveDto) {
    return this.userDeviveService.create(createUserDeviveDto);
  }

  @Get()
  findAll() {
    return this.userDeviveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userDeviveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDeviveDto: UpdateUserDeviveDto) {
    return this.userDeviveService.update(+id, updateUserDeviveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDeviveService.remove(+id);
  }
}

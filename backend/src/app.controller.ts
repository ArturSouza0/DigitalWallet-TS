import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { CreateUserDto, FindUserDto } from './user/dtos/create.user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('findUserById')
  async findUserById(@Body() body: FindUserDto) {
    return await this.userService.findUserById(body.id);
  }
  @Get('findUserByAll')
  async findUserByAll(@Body() body: FindUserDto) {
    return await this.userService.findUserByAll();
  }
  @Post('createUser')
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }
}

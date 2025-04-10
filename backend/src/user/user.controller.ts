import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dtos/create-user.dto';
  import { FindUserDto } from './dtos/find-user.dto';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post('createUser')
    async create(@Body() body: CreateUserDto) {
      return this.userService.createUser(body);
    }
  
    @Get('findAllUsers')
    async findAll(): Promise<FindUserDto[]> {
      return this.userService.findAllUsers();
    }
  
    @Get('findUserById/:id')
    async findById(@Param('id') id: string): Promise<FindUserDto> {
      return this.userService.findUserById(Number(id));
    }
  
    @Get('findUserByEmail/:email')
    async findByEmail(@Param('email') email: string) {
      return this.userService.findUserByEmail(email);
    }
  
    @Put('updateUser/:id')
    async update(@Param('id') id: string, @Body() body: CreateUserDto) {
      return this.userService.updateUser(Number(id), body);
    }
  
    @Delete('deleteUser/:id')
    async delete(@Param('id') id: string) {
      return this.userService.deleteUser(Number(id));
    }
  }
  
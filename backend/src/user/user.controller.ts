import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create.user.dto";

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get('findUserByEmail/:email')
    async findUserByEmail(@Param('email') email: string) {
        return await this.userService.findUserByEmail(email);
    }

    @Get('findUserById/:id')
    async findUserById(@Param('id') id: string) {
        return await this.userService.findUserById(parseInt(id, 10));
    }

    @Get('findUserByAll')
    async findUserByAll() {
        return await this.userService.findUserByAll();
    }

    @Post('createUser')
    async createUser(@Body() body: CreateUserDto) {
        return await this.userService.createUser(body);
    }

    @Put('updateUser/:id')
    async updateUser(@Param('id') id: string, @Body() body: CreateUserDto) {
        return await this.userService.updateUser(parseInt(id, 10), body);
    }

    @Delete('deleteUser/:id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.deleteUser(parseInt(id, 10));
    }
}
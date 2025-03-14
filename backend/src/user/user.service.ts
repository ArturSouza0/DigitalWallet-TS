import { Injectable, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, FindUserDto } from 'src/user/dtos/create.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(body: CreateUserDto) {
        const { username, password_hash, email } = body;
        try {
            let hashedPassword = await bcrypt.hash(password_hash, 10);
            await this.prisma.users.create({
                data: {
                    username,
                    email,
                    password_hash: hashedPassword,
                    //  created_at: new Date(),
                },
            });
            return { message: 'User created successfully' };
        } catch (error) {
            console.error(error);
            return { message: 'User creation failed' };
        }
    }

    async findUserById(id: number): Promise<FindUserDto[]> {
        try {
            return await this.prisma.users.findMany({
                where: {
                    id,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            });
        }
        catch (error) {
            console.error(error);
            return [{ id: 0, username: 'User not found', email: 'User not found' }];
        }
    }

    async findUserByAll(): Promise<FindUserDto[]> {
        try {
            return await this.prisma.users.findMany({
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            });
        }
        catch (error) {
            console.error(error);
            return [{ id: 0, username: 'User not found', email: 'User not found' }]
        }
    }

}
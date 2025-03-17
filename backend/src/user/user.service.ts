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

    async updateUser(id: number, body: CreateUserDto) {
        const { username, password_hash, email } = body;
        try {   
            let hashedPassword = await bcrypt.hash(password_hash, 10);
            await this.prisma.users.update({
                where: {
                    id,
                },
                data: {
                    username,
                    email,
                    password_hash: hashedPassword,
                },
            });
            return { message: 'User updated successfully' };
        }
        catch (error) {
            console.error(error);
            return { message: 'User update failed' };
        }
    }

    async deleteUser(id: number) {
        try {
            await this.prisma.users.delete({
                where: {
                    id,
                },
            });
            return { message: 'User deleted successfully' };
        }
        catch (error) {
            console.error(error);
            return { message: 'User deletion failed' };
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

    async findUserByEmail(email: string): Promise<CreateUserDto | null> {
        try {
            const user = await this.prisma.users.findUnique({
                where: {
                    email,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    password_hash: true,
                },
            });

            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
// src/user/user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from './interfaces/user.repository.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserDto } from './dtos/find-user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<void> {
    await this.prisma.users.create({ data });
  }

  async updateUser(id: number, data: CreateUserDto): Promise<void> {
    await this.prisma.users.update({ where: { id }, data });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.users.delete({ where: { id } });
  }

  async findUserById(id: number): Promise<FindUserDto | null> {
    return this.prisma.users.findUnique({
      where: { id },
      select: { id: true, username: true, email: true }
    });
  }

  async findAllUsers(): Promise<FindUserDto[]> {
    return this.prisma.users.findMany({
      select: { id: true, username: true, email: true }
    });
  }

  async findUserByEmail(email: string): Promise<CreateUserDto | null> {
    return this.prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password_hash: true
      }
    });
  }

  async existsByEmailOrUsername(email: string, username?: string): Promise<boolean> {
    const user = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email },
          ...(username ? [{ username }] : [])
        ]
      }
    });
    return !!user;
  }
}

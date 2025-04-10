
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserDto } from './dtos/find-user.dto';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from './interfaces/user.repository.interface';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) { }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private async validateUniqueFields(email: string, username?: string): Promise<void> {
    const exists = await this.userRepository.existsByEmailOrUsername(email, username);
    if (exists) {
      throw new ConflictException('Email or username already in use');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      await this.validateUniqueFields(createUserDto.email, createUserDto.username);
      const hashedPassword = await this.hashPassword(createUserDto.password_hash);

      await this.userRepository.createUser({
        ...createUserDto,
        password_hash: hashedPassword,
      });

      return { message: 'User created successfully' };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(id: number, updateUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findUserById(id);
      if (!user) throw new NotFoundException('User not found');

      await this.validateUniqueFields(
        updateUserDto.email,
        updateUserDto.username !== user.username ? updateUserDto.username : undefined
      );

      const hashedPassword = updateUserDto.password_hash
        ? await this.hashPassword(updateUserDto.password_hash)
        : undefined;

      await this.userRepository.updateUser(id, {
        ...updateUserDto,
        password_hash: hashedPassword ?? updateUserDto.password_hash,
      });

      return { message: 'User updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findUserById(id);
      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.deleteUser(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async findUserById(id: number): Promise<FindUserDto> {
    try {
      const user = await this.userRepository.findUserById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async findAllUsers(): Promise<FindUserDto[]> {
    try {
      return await this.userRepository.findAllUsers();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findUserByEmail(email: string): Promise<CreateUserDto | null> {
    try {
      return await this.userRepository.findUserByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user by email');
    }
  }
}

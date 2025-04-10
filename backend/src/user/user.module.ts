import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, {
    provide: 'IUserRepository',
    useClass: UserRepository,
  }],
  exports: [UserService],
})
export class UserModule { }

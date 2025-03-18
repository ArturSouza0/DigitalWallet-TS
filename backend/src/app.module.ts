import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, WalletModule],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: JwtAuthGuard }],
})
export class AppModule { }

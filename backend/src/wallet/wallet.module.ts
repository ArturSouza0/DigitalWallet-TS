import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WalletRepository } from './wallet.repository';

@Module({
  imports: [PrismaModule],
  providers: [WalletService,
    {
      provide: 'IWalletRepository',
      useClass: WalletRepository,
    }
  ],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}

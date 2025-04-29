import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionRepository } from './trasnsaction.repository';

@Module({
  imports: [PrismaModule],
  providers: [TransactionService,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
  ],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule { }

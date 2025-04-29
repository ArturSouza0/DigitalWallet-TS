import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dtos/transaction.dto';
import { ITransactionRepository } from './interfaces/transactions.repository.interface';
import { Decimal } from '@prisma/client/runtime/library';


@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  
  async findAll(): Promise<CreateTransactionDto[]> {
    return await this.prisma.transactions.findMany({
        include: {
            users_transactions_sender_idTousers: { select: { username: true } },
        users_transactions_receiver_idTousers: { select: { username: true } },
    },
});
}

async findById(id: number): Promise<CreateTransactionDto | null> {
    return await this.prisma.transactions.findUnique({
        where: { id },
        include: {
        users_transactions_sender_idTousers: { select: { username: true } },
        users_transactions_receiver_idTousers: { select: { username: true } },
      },
    });
}

async findByUserId(userId: number): Promise<CreateTransactionDto[]> {
    return await this.prisma.transactions.findMany({
        where: {
            OR: [{ sender_id: userId }, { receiver_id: userId }],
      },
      include: {
          users_transactions_sender_idTousers: { select: { username: true } },
          users_transactions_receiver_idTousers: { select: { username: true } },
        },
    });
}

async findWalletByUserId(userId: number) {
    return this.prisma.wallets.findUnique({
        where: { user_id: userId },
    });
}

async updateWalletBalance(userId: number, amount: Decimal, type: 'increment' | 'decrement'): Promise<void> {
    const data = { balance: { [type]: amount } };
    await this.prisma.wallets.update({
        where: { user_id: userId },
        data,
    });
}

async createTransaction(senderId: number, receiverId: number, amount: Decimal) {
    return this.prisma.transactions.create({
        data: { sender_id: senderId, receiver_id: receiverId, amount },
    });
}

async runInTransaction(actions: (() => Promise<any>)[]) {
    await this.prisma.$transaction(async (tx) => {
        for (const action of actions) {
            await action();
        }
    });
}

async delete(id: number): Promise<void> {
  await this.prisma.transactions.delete({ where: { id } });
}

}

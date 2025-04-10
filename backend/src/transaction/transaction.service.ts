import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateWallets(senderId: number, receiverId: number, amount: Decimal) {
    if (senderId === receiverId) {
      throw new BadRequestException('Sender and receiver cannot be the same');
    }

    const [senderWallet, receiverWallet] = await Promise.all([
      this.prisma.wallets.findUnique({ where: { user_id: senderId } }),
      this.prisma.wallets.findUnique({ where: { user_id: receiverId } })
    ]);

    if (!senderWallet || !receiverWallet) {
      throw new NotFoundException('Sender or receiver wallet not found');
    }

    if (senderWallet.balance === null || senderWallet.balance.lessThan(amount)) {
      throw new BadRequestException('Insufficient balance');
    }
  }

  private includeUserDetails = {
    include: {
      users_transactions_sender_idTousers: { select: { username: true } },
      users_transactions_receiver_idTousers: { select: { username: true } }
    }
  };

  async createTransaction(senderId: number, receiverId: number, amount: Decimal) {
    await this.validateWallets(senderId, receiverId, amount);

    try {
      await this.prisma.$transaction([
        this.prisma.wallets.update({
          where: { user_id: senderId },
          data: { balance: { decrement: amount } }
        }),
        this.prisma.wallets.update({
          where: { user_id: receiverId },
          data: { balance: { increment: amount } }
        }),
        this.prisma.transactions.create({
          data: { sender_id: senderId, receiver_id: receiverId, amount }
        })
      ]);

      return { message: 'Transaction completed successfully' };
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Transaction failed');
    }
  }

  async getUserTransactions(userId: number) {
    try {
      return await this.prisma.transactions.findMany({
        where: {
          OR: [
            { sender_id: userId },
            { receiver_id: userId }
          ]
        },
        ...this.includeUserDetails
      });
    } catch (error) {
      console.error('Failed to get user transactions:', error);
      throw new BadRequestException('Failed to get user transactions');
    }
  }

  async getTransactionById(transactionId: number) {
    try {
      const transaction = await this.prisma.transactions.findUnique({
        where: { id: transactionId },
        ...this.includeUserDetails
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      return transaction;
    } catch (error) {
      console.error('Failed to get transaction:', error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to get transaction');
    }
  }

  async getAllTransactions() {
    try {
      return await this.prisma.transactions.findMany({
        ...this.includeUserDetails
      });
    } catch (error) {
      console.error('Failed to get all transactions:', error);
      throw new BadRequestException('Failed to get all transactions');
    }
  }

  async deleteTransaction(transactionId: number) {
    try {
      await this.prisma.transactions.delete({
        where: { id: transactionId }
      });
      return { message: 'Transaction deleted successfully' };
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw new BadRequestException('Failed to delete transaction');
    }
  }
}
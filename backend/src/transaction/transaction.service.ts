import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { ITransactionRepository } from './interfaces/transactions.repository.interface';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository
  ) {}

  private async validateWallets(senderId: number, receiverId: number, amount: Decimal) {
    if (senderId === receiverId) {
      throw new BadRequestException('Sender and receiver cannot be the same');
    }

    const [senderWallet, receiverWallet] = await Promise.all([
      this.transactionRepository.findWalletByUserId(senderId),
      this.transactionRepository.findWalletByUserId(receiverId),
    ]);

    if (!senderWallet || !receiverWallet) {
      throw new NotFoundException('Sender or receiver wallet not found');
    }

    if (senderWallet.balance === null || senderWallet.balance.lessThan(amount)) {
      throw new BadRequestException('Insufficient balance');
    }
  }

  async createTransaction(senderId: number, receiverId: number, amount: Decimal) {
    await this.validateWallets(senderId, receiverId, amount);

    try {
      await this.transactionRepository.runInTransaction([
        () => this.transactionRepository.updateWalletBalance(senderId, amount, 'decrement'),
        () => this.transactionRepository.updateWalletBalance(receiverId, amount, 'increment'),
        () => this.transactionRepository.createTransaction(senderId, receiverId, amount),
      ]);

      return { message: 'Transaction completed successfully' };
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException('Transaction failed');
    }
}

  async getUserTransactions(userId: number) {
    try {
      return await this.transactionRepository.findByUserId(userId);
    } catch (error) {
      console.error('Failed to get user transactions:', error);
      throw new BadRequestException('Failed to get user transactions');
    }
  }

  async getTransactionById(transactionId: number) {
    try {
      const transaction = await this.transactionRepository.findById(transactionId);
      if (!transaction) throw new NotFoundException('Transaction not found');
      return transaction;
    } catch (error) {
      console.error('Failed to get transaction:', error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to get transaction');
    }
  }

  async getAllTransactions() {
    try {
      return await this.transactionRepository.findAll();
    } catch (error) {
      console.error('Failed to get all transactions:', error);
      throw new BadRequestException('Failed to get all transactions');
    }
  }

  async deleteTransaction(transactionId: number) {
    try {
      await this.transactionRepository.delete(transactionId);
      return { message: 'Transaction deleted successfully' };
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw new BadRequestException('Failed to delete transaction');
    }
  }
}

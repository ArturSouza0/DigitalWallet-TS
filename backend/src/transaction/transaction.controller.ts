import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Decimal } from '@prisma/client/runtime/library';

@Controller()
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post('createTransaction')
    async createTransaction(
        @Body('sender_id') sender_id: number,
        @Body('receiver_id') receiver_id: number,
        @Body('amount') amount: Decimal,
    ) {
        return this.transactionService.createTransaction(sender_id, receiver_id, amount);
    }

    @Get('findUserTransactions/:user_id')
    async getUserTransactions(@Param('user_id') user_id: number) {
        return this.transactionService.getUserTransactions(user_id);
    }

    @Get('findTransactionById/:transaction_id')
    async getTransactionById(@Param('transaction_id') transaction_id: number) {
        return this.transactionService.getTransactionById(transaction_id);
    }
}
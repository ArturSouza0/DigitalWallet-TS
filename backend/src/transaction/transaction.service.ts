import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) { }

    async createTransaction(sender_id: number, receiver_id: number, amount: Decimal) {
        try {
            // Verifica se as carteiras do remetente e do destinatário existem
            const senderWallet = await this.prisma.wallets.findUnique({ where: { user_id: sender_id } });
            const receiverWallet = await this.prisma.wallets.findUnique({ where: { user_id: receiver_id } });

            if (!senderWallet || !receiverWallet) {
                throw new NotFoundException('Sender or receiver wallet not found');
            }

            // Verifica se o remetente tem saldo suficiente
            if (senderWallet.balance === null || senderWallet.balance.lessThan(amount)) {
                throw new BadRequestException('Insufficient balance');
            }

            // Atualiza o saldo do remetente e do destinatário
            await this.prisma.$transaction(async (tx) => {
                // Subtrai o valor do saldo do remetente
                await tx.wallets.update({
                    where: { user_id: sender_id },
                    data: { balance: { decrement: amount } },
                });

                // Adiciona o valor ao saldo do destinatário
                await tx.wallets.update({
                    where: { user_id: receiver_id },
                    data: { balance: { increment: amount } },
                });

                // Registra a transação
                await tx.transactions.create({
                    data: {
                        sender_id,
                        receiver_id,
                        amount,
                    },
                });
            });

            return { message: 'Transaction completed successfully' };
        } catch (error) {
            console.error('Error creating transaction:', error);
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error; // Repassa exceções específicas
            }
            throw new BadRequestException('Failed to create transaction');
        }
    }

    async getUserTransactions(user_id: number) {
        try {
            const transaction = await this.prisma.transactions.findMany({
                where: {
                    OR: [
                        { sender_id: user_id },
                        { receiver_id: user_id },
                    ],
                },
                include: {
                    users_transactions_sender_idTousers: {
                        select: { username: true },
                    },
                    users_transactions_receiver_idTousers: {
                        select: { username: true },
                    },
                },
            });

            return transaction;
        } catch (error) {
            console.error('Error getting user transactions:', error);
            throw new BadRequestException('Failed to get user transactions');
        }
    }

    async getTransactionById(transaction_id: number) {
        try {
            const transaction = await this.prisma.transactions.findUnique({
                where: { id: transaction_id },
                include: {
                    users_transactions_sender_idTousers: {
                        select: { username: true },
                    },
                    users_transactions_receiver_idTousers: {
                        select: { username: true },
                    },
                }
            });
            if (!transaction) {
                throw new NotFoundException('Transaction not found');
            }

            return transaction;
        } catch (error) {
            console.error('Error getting transaction by id:', error);
            throw new BadRequestException('Failed to get transaction by id');
        }
    }

    async getAllTransactions() {
        try {
            return await this.prisma.transactions.findMany({
                include: {
                    users_transactions_sender_idTousers: {
                        select: { username: true },
                    },
                    users_transactions_receiver_idTousers: {
                        select: { username: true },
                    },
                },
            });
        } catch (error) {
            console.error('Error getting all transactions:', error);
            throw new BadRequestException('Failed to get all transactions');
        }
    }

    async deleteTransaction(transaction_id: number) {
        try {
            await this.prisma.transactions.delete({
                where: { id: transaction_id },
            });
            return { message: 'Transaction deleted successfully' };
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw new BadRequestException('Failed to delete transaction');
        }
    }

}

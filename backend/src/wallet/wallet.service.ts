import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) { }

    async createWallet(user_id: number) {
        try {
            await this.prisma.wallets.create({
                data: {
                    user_id,
                    balance: 0,
                },
            });
            return { message: 'Wallet created successfully' };
        } catch (error) {
            console.error(error);
            return { message: 'Wallet creation failed' };
        }
    }

    async updateWallet(user_id: number, balance: Decimal) {
        try {
            await this.prisma.wallets.update({
                where: {
                    user_id,
                },
                data: {
                    balance,
                },
            });
            return { message: 'Wallet updated successfully' };
        } catch (error) {
            console.error(error);
            return { message: 'Wallet update failed' };
        }
    }

    async deleteWallet(user_id: number) {
        try {
            await this.prisma.wallets.delete({
                where: {
                    user_id,
                },
            });
            return { message: 'Wallet deleted successfully' };
        } catch (error) {
            console.error(error);
            return { message: 'Wallet deletion failed' };
        }
    }

    async getWallet(user_id: number) {
        try {
            return await this.prisma.wallets.findUnique({
                where: {
                    user_id,
                },
            });
        } catch (error) {
            console.error(error);
            return { message: 'Wallet retrieval failed' };
        }
    }

    async getAllWallets() {
        try {
            return await this.prisma.wallets.findMany();
        } catch (error) {
            console.error(error);
            return { message: 'Wallet retrieval failed' };
        }
    }

    async getWalletBalance(user_id: number) {
        try {
            return await this.prisma.wallets.findUnique({
                where: {
                    user_id,
                },
                select: {
                    balance: true,
                },
            });
        } catch (error) {
            console.error(error);
            return { message: 'Wallet balance retrieval failed' };
        }
    }
}
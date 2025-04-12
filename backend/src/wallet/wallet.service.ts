
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { IWalletRepository } from './interfaces/wallet.repository.interface';
import { CreateWalletDto } from './dtos/wallet.dto';

@Injectable()
export class WalletService {

    constructor(
        @Inject('IWalletRepository')
        private readonly walletRepository: IWalletRepository
    ) { }


    private async ensureUserExists(userId: number): Promise<void> {
        const user = await this.walletRepository.findWalletByUserId(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
    }

    async createWallet(data: CreateWalletDto): Promise<{ message: string }> {
        try {
            const exists = await this.walletRepository.existsByUserId(data.user_id);
            if (exists) {
                throw new Error('Wallet already exists for this user');
            }

            await this.walletRepository.createWallet(data);
            return { message: 'Wallet created successfully' };
        } catch (error) {
            console.error('Error creating wallet:', error);
            return { message: 'Wallet creation failed' };
        }
    }

    async updateWallet(id: number, data: CreateWalletDto): Promise<{ message: string }> {
        try {
            const wallet = await this.walletRepository.findWalletById(id);
            if (!wallet) throw new NotFoundException('Wallet not found');

            if (data.user_id) {
                await this.ensureUserExists(data.user_id);
            }
            await this.walletRepository.updateWallet(id, data);
            return { message: 'Wallet updated successfully' };
        } catch (error) {
            console.error('Update Wallet Error:', error);
            throw new NotFoundException('Wallet not found or user does not exist');
        }
    }

    async deleteWallet(user_id: number): Promise<{ message: string }> {
        try {
            await this.walletRepository.deleteWallet(user_id);
            return { message: 'Wallet deleted successfully' };
        } catch (error) {
            console.error('Delete Wallet Error:', error);
            return { message: 'Wallet deletion failed' };
        }
    }

    async getWallet(id: number): Promise<CreateWalletDto | null> {
        try {
            return await this.walletRepository.findWalletById(id);
        } catch (error) {
            console.error('Get Wallet Error:', error);
            return null;
        }
    }

    async getAllWallets(): Promise<CreateWalletDto[]> {
        try {
            return await this.walletRepository.findAllWallets();
        } catch (error) {
            console.error('Get All Wallets Error:', error);
            return [];
        }
    }

    async getWalletByUserId(user_id: number): Promise<CreateWalletDto | null> {
        try {
            return await this.walletRepository.findWalletByUserId(user_id);
        }
        catch (error) {
            console.error('Get Wallet By User ID Error:', error);
            return null;
        }
    }

    async getWalletBalance(user_id: number): Promise<Decimal | null> {
        try {
            const wallet = await this.walletRepository.findWalletByUserId(user_id);
            return wallet ? wallet.balance : null;
        } catch (error) {
            console.error('Get Wallet Balance Error:', error);
            return null;
        }
    }

    async walletExists(user_id: number): Promise<boolean> {
        try {
            return await this.walletRepository.existsByUserId(user_id);
        } catch (error) {
            console.error('Wallet Exists Check Error:', error);
            return false;
        }
    }
}
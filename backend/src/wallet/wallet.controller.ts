import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dtos/wallet.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Controller()
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get('findWalletByUserId/:user_id')
    async findWalletByUserId(@Param('user_id') user_id: string) {
        return await this.walletService.getWallet(parseInt(user_id, 10));
    }

    @Get('findWalletByAll')
    async findWalletByAll() {
        return await this.walletService.getAllWallets();
    }

    @Get('findWalletByBalance/:user_id')
    async findWalletByBalance(@Param('user_id') user_id: string) {
        return await this.walletService.getWalletBalance(parseInt(user_id, 10));
    }

    @Post('createWallet')
    async createWallet(@Body() body: CreateWalletDto) {
        return await this.walletService.createWallet(body.user_id);
    }

    @Put('updateWallet/:user_id')
    async updateWallet(
        @Param('user_id') user_id: string,
        @Body('balance') balance: Decimal,
    ) {
        return await this.walletService.updateWallet(parseInt(user_id, 10), balance);
    }

    @Delete('deleteWallet/:user_id')
    async deleteWallet(@Param('user_id') user_id: string) {
        return await this.walletService.deleteWallet(parseInt(user_id, 10));
    }
}
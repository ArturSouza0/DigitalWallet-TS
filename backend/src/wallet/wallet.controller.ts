import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dtos/wallet.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Controller('wallets')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post('createWallet')
    async createWallet(@Body() createWalletDto: CreateWalletDto) {
      await this.walletService.createWallet(createWalletDto);
      return { message: 'Wallet created successfully' };
    }

    @Get('findWalletById/:id')
    async findWalletById(@Param('id') id: string) {
        return await this.walletService.getWallet(Number(id));
    }

    @Get('findWalletByUserId/:user_id')
    async findWalletByUserId(@Param('user_id') user_id: string) {
        return await this.walletService.getWalletByUserId(Number(user_id));
    }

    @Get('findWalletByAll')
    async findWalletByAll() {
        return await this.walletService.getAllWallets();
    }

    @Get('findWalletByBalance/:user_id')
    async findWalletByBalance(@Param('user_id') user_id: string) {
        return await this.walletService.getWalletBalance(Number(user_id));
    }

    @Put('updateWallet/:id')
    async updateWallet(
      @Param('id') id: string,
      @Body() body: { user_id: number; balance: Decimal },
    ) {
      return await this.walletService.updateWallet(Number(id), {
        user_id: body.user_id,
        balance: body.balance,
      });
    }

    @Delete('deleteWallet/:user_id')
    async deleteWallet(@Param('user_id') user_id: string) {
        return await this.walletService.deleteWallet(Number(user_id));
    }
}
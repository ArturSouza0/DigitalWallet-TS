import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IWalletRepository } from "./interfaces/wallet.repository.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateWalletDto } from "./dtos/wallet.dto";

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureUserExists(userId: number): Promise<void> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async createWallet(data: CreateWalletDto): Promise<void> {
    try {
      await this.ensureUserExists(data.user_id);

      await this.prisma.wallets.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid foreign key: user_id does not exist');
      }

      throw error;
    }
  }

  async updateWallet(id: number, data: Partial<CreateWalletDto>): Promise<void> {
    try {
      if (data.user_id) {
        await this.ensureUserExists(data.user_id);
      }

      await this.prisma.wallets.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid foreign key: user_id does not exist');
      }

      throw error;
    }
  }
  
  async deleteWallet(id: number): Promise<void> {
    await this.prisma.wallets.delete({ where: { id } });
  }

  async findWalletById(id: number): Promise<CreateWalletDto | null> {
    return this.prisma.wallets.findUnique({
      where: { id },
      select: { id: true, user_id: true, balance: true },
    });
  }

  async findAllWallets(): Promise<CreateWalletDto[]> {
    return this.prisma.wallets.findMany({
      select: { id: true, user_id: true, balance: true },
    });
  }

  async findWalletByUserId(userId: number): Promise<CreateWalletDto | null> {
    return this.prisma.wallets.findFirst({
      where: { user_id: userId },
      select: { id: true, user_id: true, balance: true },
    });
  }
  

  async existsByUserId(userId: number): Promise<boolean> {
    const count = await this.prisma.wallets.count({
      where: { user_id: userId },
    });
    return count > 0;
  }
}

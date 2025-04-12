import { CreateWalletDto } from "../dtos/wallet.dto";

export interface IWalletRepository {
    createWallet(data: CreateWalletDto): Promise<void>;
    updateWallet(id: number, data: CreateWalletDto): Promise<void>;
    deleteWallet(id: number): Promise<void>;
    findWalletById(id: number): Promise<CreateWalletDto | null>;
    findAllWallets(): Promise<CreateWalletDto[]>;
    findWalletByUserId(userId: number): Promise<CreateWalletDto | null>;
    existsByUserId(userId: number): Promise<boolean>;
}   
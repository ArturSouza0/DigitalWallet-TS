import { Decimal } from "@prisma/client/runtime/library";
import { CreateTransactionDto } from "../dtos/transaction.dto";
import { CreateWalletDto } from "src/wallet/dtos/wallet.dto";


export interface ITransactionRepository {
    delete(id: number): Promise<void>;
    findAll(): Promise<CreateTransactionDto[]>;
    findById(id: number): Promise<CreateTransactionDto | null>;
    findByUserId(userId: number): Promise<CreateTransactionDto[]>;

    findWalletByUserId(userId: number): Promise<CreateWalletDto | null>;
    updateWalletBalance(userId: number, amount: Decimal, type: 'increment' | 'decrement'): Promise<void>;
    createTransaction(senderId: number, receiverId: number, amount: Decimal): Promise<CreateTransactionDto>;
    runInTransaction(actions: any[]): Promise<void>;
}

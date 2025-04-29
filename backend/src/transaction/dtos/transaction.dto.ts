import { Decimal } from "@prisma/client/runtime/library";

export class CreateTransactionDto {
    id?: number;
    sender_id: number;
    receiver_id: number;
    amount: Decimal;
    created_at?: Date;
}

export class WalletDto {
    id: number;
    user_id: number;
    balance: Decimal | null;
    created_at: Date | null;
  }
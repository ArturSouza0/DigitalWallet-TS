import { Decimal } from "@prisma/client/runtime/library";

export class CreateWalletDto {
    id?: number;
    user_id: number;
    balance: number;
    created_at?: Date;
}
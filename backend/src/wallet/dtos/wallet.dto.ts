import { Decimal } from '@prisma/client/runtime/library';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  balance: Decimal | null;

  @IsOptional()
  created_at?: Date | null;
}

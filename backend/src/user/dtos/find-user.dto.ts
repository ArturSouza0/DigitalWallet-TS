import { IsEmail, IsInt, IsString } from 'class-validator';

export class FindUserDto {
  @IsInt({ message: 'ID must be an integer number' })
  id: number;

  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}

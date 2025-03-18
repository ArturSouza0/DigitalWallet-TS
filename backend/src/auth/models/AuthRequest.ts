import { Request } from 'express';
import { FindUserDto } from 'src/user/dtos/user.dto';

export interface AuthRequest extends Request {
    user: FindUserDto;
}
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../models/AuthRequest';
import { FindUserDto } from 'src/user/dtos/find-user.dto';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): FindUserDto => {
        const request = context.switchToHttp().getRequest<AuthRequest>();

        return request.user;
    },
);

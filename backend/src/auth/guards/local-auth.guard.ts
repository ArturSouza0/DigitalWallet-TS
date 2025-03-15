import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context) {
        if (err || !user) {
            throw new UnauthorizedException(err?.message);
        }

        const request = context.switchToHttp().getRequest();
        request.user = user;

        return user;
    }
}

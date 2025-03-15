import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FindUserDto } from 'src/user/dtos/create.user.dto';
import { UserService } from 'src/user/user.service';
import { UserToken } from './models/UserToken';
import { UserPayload } from './models/UserPayload';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    async login(user: FindUserDto, res: Response): Promise<UserToken> {
        const payload: UserPayload = {
            sub: user.id,
            username: user.username,
            email: user.email,
        };
        const acessToken = this.jwtService.sign(payload, { expiresIn: '30s' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        return { acessToken, refreshToken };
    }

    async logout(res: Response): Promise<void> {
        res.clearCookie('refreshToken');
    }

    async refresh(refreshToken: string): Promise<UserToken> {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userService.findUserById(payload.sub);
            if (!user) throw new UnauthorizedException('User not found');

            const newPayload: UserPayload = {
                sub: user[0].id,
                username: user[0].username,
                email: user[0].email,
            };
            const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '30s' });
            return { acessToken: newAccessToken, refreshToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async validateUser(email: string, password: string): Promise<FindUserDto> {
        const user = await this.userService.findUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password_hash)) {
            return {
                id: user.id!,
                username: user.username,
                email: user.email,
            };
        }
        throw new UnauthorizedException('Invalid credentials');
    }
}
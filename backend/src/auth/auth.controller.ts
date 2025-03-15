import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthRequest } from './models/AuthRequest';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Req() req: AuthRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        return await this.authService.login(req.user, res);
    }

    @IsPublic()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh( @Body() body: any) {
        const refreshToken = body?.refreshToken;

        if(!refreshToken) {
            throw new BadRequestException('Refresh token not found');
        }
        return await this.authService.refresh(refreshToken);
    }
}
import {
  ConflictException,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { GoogleProfile } from './strategy/google.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req: unknown) {
    // This route is handled by the Google OAuth2 strategy
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: { user: GoogleProfile },
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');

    try {
      const tokens = await this.authService.googleLogin(req.user);

      const redirectUrl = new URL(`${frontendUrl}/auth/callback`);
      redirectUrl.searchParams.set('accessToken', tokens.accessToken);
      redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);

      res.redirect(redirectUrl.toString());
    } catch (error) {
      if (error instanceof ConflictException) {
        const redirectUrl = new URL(`${frontendUrl}/login`);
        redirectUrl.searchParams.set('error', 'provider_mismatch');
        redirectUrl.searchParams.set('email', req.user.email);
        res.redirect(redirectUrl.toString());
        return;
      }

      const errorUrl = new URL(`${frontendUrl}/login`);
      errorUrl.searchParams.set('error', 'unknown');
      res.redirect(errorUrl.toString());
    }
  }
}

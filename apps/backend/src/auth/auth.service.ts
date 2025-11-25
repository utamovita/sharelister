import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from '@repo/schemas';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';

import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async register(registerUserDto: RegisterDto) {
    const { email, password, username } = registerUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('user.alreadyExists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const lang = I18nContext.current()?.lang ?? 'en';

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name: username,
        verificationToken,
        lang,
      },
    });

    await this.mailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.lang,
    );

    return { message: 'Verification email sent.' };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('error.invalidVerificationToken');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    });

    const tokens = await this._generateTokens({
      sub: user.id,
      email: user.email,
    });

    await this._updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async login(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('credentials.invalid');
    }

    if (user.provider !== 'credentials') {
      throw new ConflictException(
        `To konto jest zarejestrowane przez ${user.provider}. Proszę zalogować się za pomocą tej metody.`,
      );
    }

    // if (!user.emailVerified) {
    //   throw new UnauthorizedException('error.emailNotVerified');
    // }

    if (!user.passwordHash) {
      throw new UnauthorizedException('credentials.invalid');
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('credentials.invalid');
    }

    const tokens = await this._generateTokens({
      sub: user.id,
      email: user.email,
    });

    await this._updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async googleLogin(reqUser: { email: string; firstName?: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: reqUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: reqUser.email,
          name: reqUser.firstName || reqUser.email.split('@')[0],
          provider: 'google',
        },
      });
    } else if (user.provider !== 'google') {
      throw new ConflictException(
        'Konto z tym adresem e-mail już istnieje. Zaloguj się używając hasła.',
      );
    }

    const tokens = await this._generateTokens({
      sub: user.id,
      email: user.email,
    });
    await this._updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId, refreshTokenHash: { not: null } },
      data: { refreshTokenHash: null },
    });
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Access Denied');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!isRefreshTokenMatching) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this._generateTokens({
      sub: user.id,
      email: user.email,
    });

    return tokens;
  }

  private async _updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }

  private async _generateTokens(payload: { sub: string; email: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_ACCESS_EXPIRES_IN',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_REFRESH_EXPIRES_IN',
        ),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async sendPasswordResetLink(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.provider !== 'credentials') {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { email },
      data: { passwordResetToken, passwordResetExpires },
    });

    await this.mailService.sendPasswordResetEmail(email, resetToken, user.lang);
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findUnique({
      where: { passwordResetToken: hashedToken },
    });

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new UnauthorizedException('error.invalidOrExpiredToken');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }
}

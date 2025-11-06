import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      configService.getOrThrow<string>('RESEND_API_KEY'),
    );
    this.fromEmail = configService.getOrThrow<string>('EMAIL_FROM');
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/auth/verify?token=${token}`;

    await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject: 'Potwierdź swój adres e-mail w Sharelister',
      html: `<p>Dziękujemy za rejestrację! Kliknij w link, aby potwierdzić swój adres e-mail: <a href="${verificationLink}">${verificationLink}</a></p>`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject: 'Reset hasła w Sharelister',
      html: `<p>Otrzymaliśmy prośbę o zresetowanie hasła. Kliknij w link, aby kontynuować: <a href="${resetLink}">${resetLink}</a>. Jeśli to nie Ty, zignoruj tę wiadomość.</p>`,
    });
  }
}

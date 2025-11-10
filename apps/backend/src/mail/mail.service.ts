import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { Resend } from 'resend';

import { PasswordResetEmail } from './templates/password-reset.email';
import { VerificationEmail } from './templates/verification.email';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    this.resend = new Resend(
      configService.getOrThrow<string>('RESEND_API_KEY'),
    );
    this.fromEmail = configService.getOrThrow<string>('EMAIL_FROM');
  }

  async sendVerificationEmail(email: string, token: string, lang: string) {
    const verificationLink = `${this.configService.getOrThrow<string>(
      'FRONTEND_URL',
    )}/auth/verify?token=${token}`;

    const subject = this.i18n.t('mail.verification.subject', { lang });

    const translations = {
      preview: this.i18n.t('mail.verification.preview', { lang }),
      greeting: this.i18n.t('mail.verification.greeting', { lang }),
      line1: this.i18n.t('mail.verification.line1', { lang }),
      button: this.i18n.t('mail.verification.button', { lang }),
      line2: this.i18n.t('mail.verification.line2', { lang }),
      line3: this.i18n.t('mail.verification.line3', { lang }),
      salutation: this.i18n.t('mail.verification.salutation', { lang }),
    };

    await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject,
      react: VerificationEmail({ verificationLink, ...translations }),
    });
  }

  async sendPasswordResetEmail(email: string, token: string, lang: string) {
    const resetLink = `${this.configService.getOrThrow<string>(
      'FRONTEND_URL',
    )}/auth/reset-password?token=${token}`;

    const subject = this.i18n.t('mail.passwordReset.subject', { lang });

    const translations = {
      preview: this.i18n.t('mail.passwordReset.preview', { lang }),
      greeting: this.i18n.t('mail.passwordReset.greeting', { lang }),
      line1: this.i18n.t('mail.passwordReset.line1', { lang }),
      button: this.i18n.t('mail.passwordReset.button', { lang }),
      line2: this.i18n.t('mail.passwordReset.line2', { lang }),
      line3: this.i18n.t('mail.passwordReset.line3', { lang }),
      salutation: this.i18n.t('mail.passwordReset.salutation', { lang }),
    };

    await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject,
      react: PasswordResetEmail({ resetLink, ...translations }),
    });
  }
}

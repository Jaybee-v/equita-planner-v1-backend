import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IEmailService } from 'src/domain/interfaces/services/email.service';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private readonly mailerService: MailerService) {}

  async welcomeEmail(data: { name: string; email: string; url: string }) {
    const { name, email } = data;
    const subject = `Bienvenue sur Equita-Planner !`;
    console.log('Sending welcome email with context:', {
      name,
      url: data.url,
    });
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'welcome',
      context: {
        name,
        url: data.url,
      },
    });
  }

  async stableApprovalEmail(data: {
    stableName: string;
    name: string;
    email: string;
  }) {
    const { name, email, stableName } = data;
    const subject = `${data.stableName} vient de vous accepter`;
    console.log('Sending stable approval email with context:', {
      data,
    });
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'stable-approval',
      context: { name, url: process.env.FRONTEND_URL, stableName },
    });
  }

  async resetPasswordEmail(data: { email: string; url: string }) {
    const { email, url } = data;
    const subject = `Réinitialisation de votre mot de passe Equita-Planner`;
    console.log('Sending reset password email with context:', {
      data,
    });
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'reset-password',
      context: { url },
    });
  }
}

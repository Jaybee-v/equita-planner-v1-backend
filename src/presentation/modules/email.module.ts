import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from 'src/infrastructure/services/email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: process.env.EMAIL_SERVICE as string,
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          clientId: process.env.EMAIL_CLIENT_ID,
          clientSecret: process.env.EMAIL_CLIENT_SECRET,
          refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '"Equita-planner" <equita-planner@gmail.com>',
      },
      template: {
        dir: join(process.cwd(), 'dist/infrastructure/email/templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [{ provide: 'IEmailService', useClass: EmailService }],
  exports: ['IEmailService'],
})
export class EmailModule {}

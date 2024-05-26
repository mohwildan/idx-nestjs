import { Global, Module } from '@nestjs/common';
import { EmailService } from './email-service/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
          user: '46a5c6546b32a1',
          pass: 'a6a1f2b0f15417',
        },
      },
      defaults: {
        from: '"From Name" <from@example.com>',
      },
      template: {
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class ServicesModule {}

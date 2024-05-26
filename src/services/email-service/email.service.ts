import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPayloads } from '../../interface/event-types.interface';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  @OnEvent('user.reset-password')
  async forgotPasswordEmail(data: EventPayloads['user.reset-password']) {
    const { name, email, link } = data;

    const subject = `Company: Reset Password`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './templates/email/forgot-password.template.ejs',
      context: {
        link,
        name,
      },
    });
  }

  @OnEvent('user.verify-email')
  async verifyEmail(data: EventPayloads['user.verify-email']) {
    const { name, email, otp } = data;

    const subject = `OTP To Verify Email`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './templates/email/verify-email.template.ejs',
      context: {
        otp,
        name,
        link: '',
      },
      attachments: [
        {
          filename: 'logo.jpg',
          path: './public/logo.png',
          cid: 'image_logo_cid',
        },
        {
          filename: 'call.jpg',
          path: './public/call.png',
          cid: 'image_call_cid',
        },
        {
          filename: 'sms.jpg',
          path: './public/sms.png',
          cid: 'image_sms_cid',
        },
      ],
    });
  }
}

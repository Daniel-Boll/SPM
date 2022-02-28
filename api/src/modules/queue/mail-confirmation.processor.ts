import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import Mailgen = require('mailgen');
import * as nodemailer from 'nodemailer';

type ConfirmationMail = { email: string; tenant: string; callback: string };

@Processor('mail-queue')
export class MailConfirmationJob {
  @Process('send-mail')
  async sendMail(job: Job<ConfirmationMail>) {
    console.log('Trying to send mail to: ' + job.data.email);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailGenerator = new Mailgen({
      theme: 'salted',
      product: {
        name: 'Simple Password Manager',
        link: job.data.callback,
      },
    });

    const email = mailGenerator.generate({
      body: {
        intro: `Activate your account on Simple Password Manager, ${job.data.tenant}`,
        action: {
          instructions: 'Click the button below to confirm your email address.',
          button: {
            color: '#22BC66',
            text: 'Confirm email',
            link: job.data.callback,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we're always happy to help out.",
      },
    });

    const info = await transporter.sendMail({
      from: 'Simple Password Manager <no-reply@spm.com>',
      to: job.data.email,
      subject: 'Confirm your email address',
      html: email,
    });

    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

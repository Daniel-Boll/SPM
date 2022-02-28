import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('mail-queue')
    private readonly mailQueue: Queue,
  ) {}

  async addConfirmationMail(element: {
    email: string;
    tenant: string;
    callback: string;
  }) {
    await this.mailQueue.add('send-mail', {
      email: element.email,
      tenant: element.tenant,
      callback: element.callback,
    });
  }
}

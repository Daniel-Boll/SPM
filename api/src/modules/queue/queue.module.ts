import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailConfirmationJob } from './mail-confirmation.processor';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  providers: [QueueService, MailConfirmationJob],
  exports: [QueueService],
})
export class QueueModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SenderNumber } from '../../domain/entities/sender-number.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SenderNumberSelectorService {
  constructor(
    @InjectRepository(SenderNumber)
    private readonly senderRepo: Repository<SenderNumber>,
  ) {}

  async getAvailableSender(): Promise<SenderNumber | null> {
    const now = new Date();

    const senders = await this.senderRepo.find({
      where: { active: true },
      order: { lastSentAt: 'ASC' },
    });

    for (const sender of senders) {
      if (
        !sender.lastSentAt ||
        now.getTime() - new Date(sender.lastSentAt).getTime() >
          sender.cadenceInMs
      ) {
        return sender;
      }
    }

    return null;
  }

  async markSenderAsUsed(sender: SenderNumber): Promise<void> {
    sender.lastSentAt = new Date();
    await this.senderRepo.save(sender);
  }
}

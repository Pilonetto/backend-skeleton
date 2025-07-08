import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../../domain/entities/message.entity';
import { Repository } from 'typeorm';
import { Campaign } from '../../domain/entities/campaign.entity';
import { Contact } from '../../domain/entities/contact.entity';

@Injectable()
export class MessageRecorderService {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async recordMessage({
    number,
    campaignId,
    type,
    content,
    status,
    errorMessage,
    caption,
    metaMessageId,
  }: {
    number: string;
    campaignId?: number;
    type: 'text' | 'media' | 'template';
    content: string;
    status: 'success' | 'failed' | 'sent';
    errorMessage?: string;
    caption?: string;
    metaMessageId?: string;
  }) {
    const contact = await this.contactRepo.findOne({
      where: { phone: number },
    });

    const campaign = campaignId
      ? await this.campaignRepo.findOne({ where: { id: campaignId } })
      : null;

    const message = this.repo.create({
      type,
      content,
      status,
      error: errorMessage,
      caption,
      contact,
      campaign,
      metaMessageId,
    });

    return this.repo.save(message);
  }
}

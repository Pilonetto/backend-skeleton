import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from '../../../domain/entities/campaign.entity';
import { Repository } from 'typeorm';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';
import { CampaignContact } from 'src/core/whatsapp/domain/entities/campaign-contact.entity';

@Injectable()
export class CreateCampaignUseCase {
  constructor(
    @InjectRepository(Campaign)
    private readonly repo: Repository<Campaign>,

    @InjectRepository(SenderNumber)
    private readonly senderRepo: Repository<SenderNumber>,
    @InjectRepository(CampaignContact)
    private readonly contactRepo: Repository<CampaignContact>,
  ) {}

  async execute(dto: CreateCampaignDto) {
    const sender = await this.senderRepo.findOneBy({ id: dto.senderNumberId });
    if (!sender) throw new Error('Sender not found');

    const contacts: CampaignContact[] = dto.phones.map((phone) =>
      this.contactRepo.create({
        phone,
        status: 'pending',
      }),
    );

    const campaign = this.repo.create({
      name: dto.name,
      type: dto.type,
      content: dto.content,
      mediaUrl: dto.mediaUrl,
      caption: dto.caption,
      templateName: dto.templateName ? dto.templateName : null,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      status: dto.scheduledAt ? 'scheduled' : 'pending',
      senderNumber: sender,
      recipients: contacts,
    });

    return this.repo.save(campaign);
  }
}

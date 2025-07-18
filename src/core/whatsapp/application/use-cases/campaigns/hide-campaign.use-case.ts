// src/core/whatsapp/application/use-cases/campaigns/hide-campaign.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/core/whatsapp/domain/entities/campaign.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HideCampaignUseCase {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
  ) {}

  async execute(id: number, hide = true) {
    const campaign = await this.campaignRepo.findOne({
      where: { id },
    });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    campaign.hide = hide;
    return this.campaignRepo.save(campaign);
  }
}

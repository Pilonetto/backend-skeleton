import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../../../domain/entities/campaign.entity';

@Injectable()
export class GetCampaignResultsUseCase {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
  ) {}

  async execute(id: number) {
    const campaign = await this.campaignRepo.findOne({
      where: { id },
      relations: ['recipients', 'senderNumber'],
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }
}

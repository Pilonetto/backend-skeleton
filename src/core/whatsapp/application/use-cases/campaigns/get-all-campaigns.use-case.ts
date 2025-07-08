import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../../../domain/entities/campaign.entity';

@Injectable()
export class GetAllCampaignsUseCase {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
  ) {}

  async execute() {
    return this.campaignRepo.find({
      relations: ['recipients', 'senderNumber'],
      order: { createdAt: 'DESC' },
    });
  }
}

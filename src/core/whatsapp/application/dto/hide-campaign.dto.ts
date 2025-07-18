// src/core/whatsapp/application/dto/hide-campaign.dto.ts
import { IsBoolean, IsOptional } from 'class-validator';

export class HideCampaignDto {
  @IsBoolean()
  hide: boolean = true;
}

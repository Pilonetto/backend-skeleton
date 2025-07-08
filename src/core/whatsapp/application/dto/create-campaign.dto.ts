// src/core/whatsapp/application/dto/create-campaign.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsDateString,
  IsPhoneNumber,
  IsArray,
} from 'class-validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['text', 'media'])
  type: 'text' | 'media';

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsNotEmpty()
  senderNumberId: number;

  @IsOptional()
  templateName?: string;

  @IsArray()
  @IsPhoneNumber(null, { each: true })
  phones: string[];
}

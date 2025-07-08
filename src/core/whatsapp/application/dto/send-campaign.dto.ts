import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCampaignDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  senderNumberId: number;

  @ApiProperty({ type: [String], example: ['5511999999999', '5511988888888'] })
  @IsArray()
  phones: string[];

  @ApiProperty({ example: 'Confira nossa nova promoção!' })
  @IsString()
  message: string;

  @ApiProperty({ required: false, example: 'https://exemplo.com/promocao.pdf' })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsOptional()
  campaignId?: number;
}

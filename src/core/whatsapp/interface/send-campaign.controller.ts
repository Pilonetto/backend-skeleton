import { Body, Controller, Post } from '@nestjs/common';
import { SendCampaignDto } from '../application/dto/send-campaign.dto';
import { SendCampaignUseCase } from '../application/use-cases/campaigns/send-campaign.use-case';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Campaigns')
@Controller('campaigns')
export class SendCampaignController {
  constructor(private readonly useCase: SendCampaignUseCase) {}

  @Post('send')
  @ApiResponse({ status: 200, description: 'Campaign sent to recipients' })
  async send(@Body() dto: SendCampaignDto) {
    return this.useCase.execute(dto);
  }
}

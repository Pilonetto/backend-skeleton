import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCampaignDto } from '../../application/dto/create-campaign.dto';
import { CreateCampaignUseCase } from '../../application/use-cases/campaigns/create-campaign.use-case';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GetAllCampaignsUseCase } from '../../application/use-cases/campaigns/get-all-campaigns.use-case';
import { GetCampaignResultsUseCase } from '../../application/use-cases/campaigns/get-campaign-results.use-case';
import { SendCampaignUseCase } from '../../application/use-cases/campaigns/send-campaign.use-case';
import { SendCampaignDto } from '../../application/dto/send-campaign.dto';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(
    private readonly useCase: CreateCampaignUseCase,
    private readonly getAllUseCase: GetAllCampaignsUseCase,
    private readonly getResultsUseCase: GetCampaignResultsUseCase,
    private readonly sendCampaignUseCase: SendCampaignUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Campaign created' })
  async create(@Body() dto: CreateCampaignDto) {
    return this.useCase.execute(dto);
  }
  @Get()
  @ApiResponse({ status: 200, description: 'Get all campaigns' })
  findAll() {
    return this.getAllUseCase.execute();
  }

  @Get(':id/results')
  @ApiResponse({ status: 200, description: 'Get campaign results' })
  getResults(@Param('id') id: number) {
    return this.getResultsUseCase.execute(id);
  }

  @Post('send')
  @ApiResponse({ status: 200, description: 'Send campaign now' })
  sendCampaign(@Body() dto: SendCampaignDto) {
    return this.sendCampaignUseCase.execute(dto);
  }
}

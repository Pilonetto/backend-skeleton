import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsappController } from './interface/controllers/whatsapp.controller';
import { WhatsappService } from './infrastructure/services/whatsapp.service';
import { OfficialWhatsappStrategy } from './infrastructure/strategies/official-whatsapp.strategy';
import { UnofficialWhatsappStrategy } from './infrastructure/strategies/unofficial-whatsapp.strategy';
import { WhatsappStrategyFactory } from './infrastructure/whatsapp.strategy.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './domain/entities/contact.entity';
import { Campaign } from './domain/entities/campaign.entity';
import { Message } from './domain/entities/message.entity';
import { SenderNumber } from './domain/entities/sender-number.entity';
import { SenderNumberSelectorService } from './application/services/sender-number-selector.service';
import { MessageRecorderService } from './application/services/message-recorder.service';
import { CampaignController } from './interface/controllers/campaign.controller';
import { ContactController } from './interface/controllers/contact.controller';
import { MessageController } from './interface/controllers/message.controller';
import { GetAllMessagesUseCase } from './application/use-cases/campaigns/get-all-messages.use-case';
import { CreateContactUseCase } from './application/use-cases/campaigns/create-contact.use-case';
import { CreateCampaignUseCase } from './application/use-cases/campaigns/create-campaign.use-case';
import { SendCampaignController } from './interface/send-campaign.controller';
import { SendCampaignUseCase } from './application/use-cases/campaigns/send-campaign.use-case';
import { SenderNumberController } from './interface/controllers/sender-number.controller';
import { CreateSenderUseCase } from './application/use-cases/sender-numbers/create-sender.use-case';
import { UpdateSenderUseCase } from './application/use-cases/sender-numbers/update-sender.use-case';
import { DeleteSenderUseCase } from './application/use-cases/sender-numbers/delete-sender.use-case';
import { FindAllSendersUseCase } from './application/use-cases/sender-numbers/find-all-senders.use-case';
import { CampaignContact } from './domain/entities/campaign-contact.entity';
import { GetAllCampaignsUseCase } from './application/use-cases/campaigns/get-all-campaigns.use-case';
import { GetCampaignResultsUseCase } from './application/use-cases/campaigns/get-campaign-results.use-case';
import { CampaignSchedulerService } from './application/services/campaign-scheduler.service';
import { FetchTemplatesUseCase } from './application/use-cases/sender-numbers/fetch-templates.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      Campaign,
      Message,
      SenderNumber,
      CampaignContact,
    ]),
    ConfigModule,
  ],
  controllers: [
    WhatsappController,
    CampaignController,
    ContactController,
    MessageController,
    SendCampaignController,
    SenderNumberController,
  ],
  providers: [
    WhatsappService,
    OfficialWhatsappStrategy,
    UnofficialWhatsappStrategy,
    WhatsappStrategyFactory,
    SenderNumberSelectorService,
    MessageRecorderService,
    GetAllMessagesUseCase,
    CreateCampaignUseCase,
    CreateContactUseCase,
    SendCampaignUseCase,
    CreateSenderUseCase,
    UpdateSenderUseCase,
    DeleteSenderUseCase,
    FindAllSendersUseCase,
    GetAllCampaignsUseCase,
    GetCampaignResultsUseCase,
    CampaignSchedulerService,
    FetchTemplatesUseCase,
  ],
})
export class WhatsappModule {}

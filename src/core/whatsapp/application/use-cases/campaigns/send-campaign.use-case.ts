import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SenderNumber } from 'src/core/whatsapp/domain/entities/sender-number.entity';
import { Repository } from 'typeorm';
import { SendCampaignDto } from '../../dto/send-campaign.dto';
import { MessageRecorderService } from '../../services/message-recorder.service';
import { OfficialWhatsappStrategy } from 'src/core/whatsapp/infrastructure/strategies/official-whatsapp.strategy';
import { UnofficialWhatsappStrategy } from 'src/core/whatsapp/infrastructure/strategies/unofficial-whatsapp.strategy';
import { IWhatsappStrategy } from 'src/core/whatsapp/domain/interfaces/whatsapp-strategy.interface';

@Injectable()
export class SendCampaignUseCase {
  constructor(
    @InjectRepository(SenderNumber)
    private readonly senderRepo: Repository<SenderNumber>,
    private readonly recorder: MessageRecorderService,
  ) {}

  private getStrategy(sender: SenderNumber): IWhatsappStrategy {
    if (sender.provider === 'official') {
      return new OfficialWhatsappStrategy({
        get: (key: string) => {
          const map = {
            WHATSAPP_TOKEN: sender.token,
            WHATSAPP_PHONE_NUMBER_ID: sender.phoneNumberId,
            WHATSAPP_API_URL: 'https://graph.facebook.com/v19.0',
          };
          return map[key];
        },
      } as any);
    }
    return new UnofficialWhatsappStrategy();
  }

  async execute(dto: SendCampaignDto) {
    const sender = await this.senderRepo.findOneBy({ id: dto.senderNumberId });

    if (!sender || !sender.active) {
      throw new NotFoundException('Sender number not found or inactive');
    }

    const strategy = this.getStrategy(sender);
    const results = [];

    for (const phone of dto.phones) {
      try {
        let result;

        if (dto.mediaUrl) {
          result = await strategy.sendMediaMessage(
            phone,
            dto.mediaUrl,
            dto.message,
          );

          await this.recorder.recordMessage({
            number: phone,
            type: 'media',
            content: dto.mediaUrl,
            status: 'success',
            errorMessage: null,
            caption: dto.message,
            campaignId: dto.campaignId,
          });
        } else {
          result = await strategy.sendTextMessage(phone, dto.message, sender);

          await this.recorder.recordMessage({
            number: phone,
            type: 'text',
            content: dto.message,
            status: 'success',
            errorMessage: null,
            campaignId: dto.campaignId,
          });
        }

        results.push({ phone, success: true, result });
      } catch (error) {
        await this.recorder.recordMessage({
          number: phone,
          type: dto.mediaUrl ? 'media' : 'text',
          content: dto.mediaUrl || dto.message,
          status: 'failed',
          errorMessage: error.message,
          caption: dto.mediaUrl ? dto.message : undefined,
          campaignId: dto.campaignId,
        });

        results.push({ phone, success: false, error: error.message });
      }
    }

    return results;
  }
}

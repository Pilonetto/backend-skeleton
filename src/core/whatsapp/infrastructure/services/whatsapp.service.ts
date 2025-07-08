import { Injectable, BadRequestException } from '@nestjs/common';
import { SendTextDto } from '../../application/dto/send-text.dto';
import { SendMediaDto } from '../../application/dto/send-media.dto';
import { SenderNumberSelectorService } from '../../application/services/sender-number-selector.service';
import { OfficialWhatsappStrategy } from '../strategies/official-whatsapp.strategy';
import { UnofficialWhatsappStrategy } from '../strategies/unofficial-whatsapp.strategy';
import { IWhatsappStrategy } from '../../domain/interfaces/whatsapp-strategy.interface';
import { MessageRecorderService } from '../../application/services/message-recorder.service';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly selector: SenderNumberSelectorService,
    private readonly recorder: MessageRecorderService,
  ) {}

  private getStrategyForSender(sender): IWhatsappStrategy {
    if (sender.provider === 'official') {
      return new OfficialWhatsappStrategy({
        get: (key: string) => {
          const map = {
            WHATSAPP_TOKEN: sender.token,
            WHATSAPP_PHONE_NUMBER_ID: sender.phoneNumberId,
            WHATSAPP_API_URL: 'https://graph.facebook.com/v19.0', // Ou vir do .env
          };
          return map[key];
        },
      } as any);
    } else {
      return new UnofficialWhatsappStrategy();
    }
  }

  async sendText(dto: SendTextDto) {
    const sender = await this.selector.getAvailableSender();

    if (!sender) {
      throw new BadRequestException(
        'No available sender at the moment. Try again later.',
      );
    }

    const strategy = this.getStrategyForSender(sender);
    const result = await strategy.sendTextMessage(dto.to, dto.message, sender);

    const status = result.ok ? 'success' : 'failed';
    const errorMessage = result.ok ? null : (result.error ?? 'Unknown error');

    await this.recorder.recordMessage({
      number: dto.to,
      campaignId: dto['campaignId'],
      type: 'text',
      content: dto.message,
      status,
      errorMessage,
    });

    return {
      sender: sender.phoneNumber,
      status,
      result,
    };
  }

  async sendMedia(dto: SendMediaDto) {
    const sender = await this.selector.getAvailableSender();

    if (!sender) {
      throw new BadRequestException(
        'No available sender at the moment. Try again later.',
      );
    }

    const strategy = this.getStrategyForSender(sender);
    const result = await strategy.sendMediaMessage(
      dto.to,
      dto.media,
      dto.caption,
      sender,
    );

    const status = result.ok ? 'success' : 'failed';
    const errorMessage = result.ok ? null : (result.error ?? 'Unknown error');

    await this.recorder.recordMessage({
      number: dto.to,
      campaignId: dto['campaignId'],
      type: 'media',
      content: 'media',
      status,
      errorMessage,
    });

    return {
      sender: sender.phoneNumber,
      status,
      result,
    };
  }

  async getStatus() {
    const sender = await this.selector.getAvailableSender();
    if (!sender) return 'No sender available';
    const strategy = this.getStrategyForSender(sender);
    return strategy.getStatus();
  }
}

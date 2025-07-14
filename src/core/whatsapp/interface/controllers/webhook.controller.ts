import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { RegisterMessageInteractionUseCase } from '../../application/use-cases/campaigns/register-message-interaction.use-case';

@Controller('webhook')
export class WhatsAppWebhookController {
  constructor(
    private readonly registerInteractionUseCase: RegisterMessageInteractionUseCase,
  ) {}
  private readonly logger = new Logger(WhatsAppWebhookController.name);

  @Get()
  @HttpCode(200)
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN ?? 'A7rxD2Kpe9';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      this.logger.log('Webhook verificado com sucesso.');
      return challenge;
    } else {
      return 'Erro de verificação';
    }
  }

  // Receber mensagens e eventos
  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Headers('x-hub-signature-256') signature: string,
    @Body() body: any,
  ) {
    this.logger.log('Webhook recebido:', JSON.stringify(body, null, 2));

    await this.registerInteractionUseCase.execute(body);
    return 'EVENT_RECEIVED';
  }
}

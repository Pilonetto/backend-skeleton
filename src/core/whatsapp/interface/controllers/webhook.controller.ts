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

@Controller('webhook')
export class WhatsAppWebhookController {
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

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value?.messages) {
      for (const message of value.messages) {
        this.logger.log(`Mensagem de ${message.from}: ${message.text?.body}`);
      }
    }

    if (value?.statuses) {
      for (const status of value.statuses) {
        this.logger.log(`Status: ${status.status} para ${status.recipient_id}`);
      }
    }

    return 'EVENT_RECEIVED';
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { WhatsappService } from '../../infrastructure/services/whatsapp.service';
import { SendTextDto } from '../../application/dto/send-text.dto';
import { SendMediaDto } from '../../application/dto/send-media.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('WhatsApp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly service: WhatsappService) {}

  @Post('send-text')
  @ApiResponse({ status: 200, description: 'Text message sent' })
  sendText(@Body() dto: SendTextDto) {
    return this.service.sendText(dto);
  }

  @Post('send-media')
  @ApiResponse({ status: 200, description: 'Media message sent' })
  sendMedia(@Body() dto: SendMediaDto) {
    return this.service.sendMedia(dto);
  }

  @Get('status')
  @ApiResponse({ status: 200, description: 'Current strategy status' })
  getStatus() {
    return this.service.getStatus();
  }
}

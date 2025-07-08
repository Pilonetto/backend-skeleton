// fetch-templates.use-case.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SenderNumber } from 'src/core/whatsapp/domain/entities/sender-number.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FetchTemplatesUseCase {
  constructor(
    @InjectRepository(SenderNumber)
    private readonly senderRepo: Repository<SenderNumber>,
  ) {}

  async execute(
    senderNumberId: string,
  ): Promise<{ id: string; name: string }[]> {
    const sender = await this.senderRepo.findOneBy({
      id: Number(senderNumberId),
    });
    if (
      !sender ||
      !sender.token ||
      !sender.provider ||
      sender.provider !== 'official'
    ) {
      throw new Error('Sender number inválido ou sem configuração da Meta');
    }

    const version = 'v19.0'; // ou dinamicamente por config
    const url = `https://graph.facebook.com/${version}/${sender.wabaId}/message_templates`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${sender.token}`,
      },
    });

    return (response.data?.data || []).map((template: any) => ({
      id: template.id,
      name: template.name,
    }));
  }
}

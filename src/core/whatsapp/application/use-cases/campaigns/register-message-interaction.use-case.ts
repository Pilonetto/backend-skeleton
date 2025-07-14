import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/core/whatsapp/domain/entities/message.entity';
import { Repository } from 'typeorm';
import { In } from 'typeorm';

@Injectable()
export class RegisterMessageInteractionUseCase {
  private readonly logger = new Logger(RegisterMessageInteractionUseCase.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async execute(payload: any): Promise<void> {
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value) return;

    // 1. Interações (botão ou texto)
    if (value.messages) {
      for (const message of value.messages) {
        const from = message.from;
        const type = message.type;

        let interactionType: 'button' | 'text' | undefined;
        let interactionContent: string | undefined;

        if (type === 'button') {
          interactionType = 'button';
          interactionContent = message.button?.payload;
        } else if (type === 'text') {
          interactionType = 'text';
          interactionContent = message.text?.body;
        }

        if (interactionType && interactionContent) {
          const recentMessage = await this.messageRepo.findOne({
            where: {
              status: In(['sent', 'success']),
              contact: { phone: from },
            },
            order: { createdAt: 'DESC' },
            relations: ['contact'],
          });

          if (recentMessage) {
            recentMessage.interactionType = interactionType;
            recentMessage.interaction = interactionContent;
            recentMessage.status = 'success';

            await this.messageRepo.save(recentMessage);
            this.logger.log(
              `Interação registrada de ${from}: [${interactionType}] ${interactionContent}`,
            );
          }
        }
      }
    }

    // 2. Status de entrega/leitura/falha
    if (value.statuses) {
      for (const status of value.statuses) {
        const messageId = status.id;
        const messageStatus = status.status;

        const updateData: Partial<Message> = {
          status:
            messageStatus === 'read' || messageStatus === 'delivered'
              ? 'success'
              : 'failed',
        };

        if (messageStatus === 'read' || messageStatus === 'delivered') {
          updateData.interactionType = messageStatus as 'read' | 'delivered';
          updateData.interaction = messageStatus;
        }

        await this.messageRepo.update({ metaMessageId: messageId }, updateData);
        this.logger.log(
          `Status atualizado: ${messageStatus} para metaMessageId ${messageId}`,
        );
      }
    }
  }
}

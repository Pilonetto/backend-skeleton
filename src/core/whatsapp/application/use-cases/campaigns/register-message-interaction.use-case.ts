import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignContact } from 'src/core/whatsapp/domain/entities/campaign-contact.entity';
import { Campaign } from 'src/core/whatsapp/domain/entities/campaign.entity';
import { Contact } from 'src/core/whatsapp/domain/entities/contact.entity';
import { Message } from 'src/core/whatsapp/domain/entities/message.entity';
import { WhatsappStrategyFactory } from 'src/core/whatsapp/infrastructure/whatsapp.strategy.factory';
import { Repository } from 'typeorm';

@Injectable()
export class RegisterMessageInteractionUseCase {
  private readonly logger = new Logger(RegisterMessageInteractionUseCase.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(CampaignContact)
    private readonly campaignContactRepo: Repository<CampaignContact>,

    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,

    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,

    private readonly strategyFactory: WhatsappStrategyFactory,
  ) {}

  async execute(payload: any): Promise<void> {
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value) return;

    const waId = value.contacts?.[0]?.wa_id;
    const contactName = value.contacts?.[0]?.profile?.name || 'Desconhecido';

    // Cria ou recupera o contato
    let contact = await this.contactRepo.findOne({ where: { phone: waId } });

    if (!contact && waId) {
      contact = this.contactRepo.create({ phone: waId, name: contactName });
      contact = await this.contactRepo.save(contact);
      this.logger.log(`Novo contato salvo: ${contact.name} (${contact.phone})`);
    }

    // 1. Interações (botão ou texto)
    if (value.messages) {
      for (const message of value.messages) {
        const interactionType =
          message.type === 'button'
            ? 'button'
            : message.type === 'text'
              ? 'text'
              : undefined;

        const interactionContent =
          message.button?.payload || message.text?.body || '';

        const metaMessageId = message.context?.id;

        if (!metaMessageId || !interactionType || !interactionContent) {
          this.logger.warn(
            'Interação sem context.id ou conteúdo inválido — ignorada.',
          );
          continue;
        }

        // Atualiza Message
        const recentMessage = await this.messageRepo.findOne({
          where: { metaMessageId },
          relations: ['contact'],
        });

        if (recentMessage) {
          recentMessage.interactionType = interactionType;
          recentMessage.interaction = interactionContent;
          recentMessage.status = 'success';
          await this.messageRepo.save(recentMessage);
          this.logger.log(
            `Mensagem atualizada: interação [${interactionType}] ${interactionContent}`,
          );
        }

        // Atualiza CampaignContact + associa o contato
        const recipient = await this.campaignContactRepo.findOne({
          where: { metaMessageId },
          relations: ['campaign'],
        });

        if (recipient) {
          recipient.interactionType = interactionType;
          recipient.interaction = interactionContent;
          recipient.status = 'success';
          recipient.contact = contact;
          await this.campaignContactRepo.save(recipient);

          this.logger.log(
            `Recipient atualizado: interação [${interactionType}] ${interactionContent}`,
          );

          // Classificação da resposta
          const normalized = interactionContent
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();

          const positives = [
            'sim',
            'quero',
            'saiba mais',
            'interessado',
            'quero participar',
            'quero sim',
            'pode enviar',
            'sim, quero saber mais!',
            'me mostra como',
            'sim, quero contar',
          ];
          const negatives = [
            'nao',
            'nao quero',
            'nao tenho interesse',
            'obrigado',
            'dispenso',
            'agora nao',
            'sem interesse',
            'agora nao, obrigado',
            'nao tenho interesse agora',
          ];

          let replyType: 'positive' | 'negative' | 'unknown' = 'unknown';
          if (positives.includes(normalized)) replyType = 'positive';
          else if (negatives.includes(normalized)) replyType = 'negative';

          // Follow-up
          const campaign = recipient.campaign;
          let followupTemplateName: string | undefined;

          if (replyType === 'positive') {
            followupTemplateName = campaign.positiveReplyTemplateName;
          } else if (replyType === 'negative') {
            followupTemplateName = campaign.negativeReplyTemplateName;
          }

          const _campaign = await this.campaignRepo.findOne({
            where: {
              id: campaign.id,
            } as any,
            relations: ['senderNumber', 'recipients', 'recipients.contact'],
          });

          if (followupTemplateName) {
            const strategy = this.strategyFactory.create(
              _campaign.senderNumber,
            );
            await strategy.sendTempateMessage(
              recipient.phone,
              followupTemplateName,
              _campaign.senderNumber,
            );
            // await this.whatsappService.sendTemplate({
            //   to: recipient.phone,
            //   templateName: followupTemplateName,
            //   senderNumber: campaign.senderNumber,
            //   variables: [contact?.name || ''],
            // });

            this.logger.log(
              `Follow-up enviado: ${replyType} → ${followupTemplateName}`,
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

        // Atualiza Message
        await this.messageRepo.update({ metaMessageId: messageId }, updateData);

        // Atualiza CampaignContact
        const recipient = await this.campaignContactRepo.findOne({
          where: { metaMessageId: messageId },
        });

        if (recipient) {
          if (messageStatus === 'read' || messageStatus === 'delivered') {
            recipient.interactionType = messageStatus;
            recipient.interaction = messageStatus;
            recipient.status = messageStatus;
          } else {
            recipient.status = 'failed';
            recipient.errorMessage = 'Falha na entrega';
          }

          await this.campaignContactRepo.save(recipient);
        }

        this.logger.log(
          `Status atualizado: ${messageStatus} para metaMessageId ${messageId}`,
        );
      }
    }
  }
}

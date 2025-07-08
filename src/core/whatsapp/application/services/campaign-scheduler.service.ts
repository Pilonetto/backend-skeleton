import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Campaign } from '../../domain/entities/campaign.entity';
import { CampaignContact } from '../../domain/entities/campaign-contact.entity';
import { WhatsappStrategyFactory } from '../../infrastructure/whatsapp.strategy.factory';
import { MessageRecorderService } from '../services/message-recorder.service';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class CampaignSchedulerService {
  private readonly logger = new Logger(CampaignSchedulerService.name);

  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,

    @InjectRepository(CampaignContact)
    private readonly contactRepo: Repository<CampaignContact>,

    private readonly strategyFactory: WhatsappStrategyFactory,
    private readonly recorder: MessageRecorderService,
  ) {}

  @Interval(30000) // a cada 30 segundos
  async handle() {
    await this.executeScheduledCampaigns();
  }

  async executeScheduledCampaigns() {
    const now = new Date();

    const campaigns = await this.campaignRepo.find({
      where: {
        status: 'scheduled',
        scheduledAt: LessThanOrEqual(now),
      } as any,
      relations: ['senderNumber', 'recipients', 'recipients.contact'],
    });

    for (const campaign of campaigns) {
      campaign.status = 'executing';
      await this.campaignRepo.save(campaign);

      const strategy = this.strategyFactory.create(campaign.senderNumber);

      for (const recipient of campaign.recipients) {
        const phone = recipient.phone;

        try {
          let result;

          if (campaign.type === 'media') {
            result = await strategy.sendMediaMessage(
              phone,
              campaign.mediaUrl,
              campaign.caption,
            );
          } else if (campaign.type === 'text') {
            result = await strategy.sendTextMessage(
              phone,
              campaign.content,
              campaign.senderNumber,
            );
          } else {
            result = await strategy.sendTempateMessage(
              phone,
              campaign.templateName,
              campaign.senderNumber,
            );
          }

          const messageId = result?.data?.messages?.[0]?.id ?? null;
          const messageStatus =
            result?.data?.messages?.[0]?.message_status ?? 'sent';

          recipient.status = messageStatus === 'accepted' ? 'sent' : 'pending';
          recipient.metaMessageId = messageId;
          recipient.errorMessage = result.ok ? null : (result.error ?? 'ok');
        } catch (err) {
          recipient.status = 'failed';
          recipient.errorMessage = err.message;
          recipient.metaMessageId = null;
        }

        await this.contactRepo.save(recipient);
      }

      const hasFailure = campaign.recipients.some((r) => r.status === 'failed');
      campaign.status = hasFailure ? 'failed' : 'completed';
      await this.campaignRepo.save(campaign);
    }
  }

  async executePendingCampaigns() {
    const now = new Date();

    const campaigns = await this.campaignRepo.find({
      where: {
        status: 'scheduled',
        scheduledAt: LessThanOrEqual(now),
      },
      relations: ['recipients', 'senderNumber'],
    });

    for (const campaign of campaigns) {
      try {
        this.logger.log(`Starting campaign ${campaign.id}...`);
        campaign.status = 'executing';
        await this.campaignRepo.save(campaign);

        const strategy = this.strategyFactory.create(campaign.senderNumber);

        for (const recipient of campaign.recipients) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result =
              campaign.type === 'text'
                ? await strategy.sendTextMessage(
                    recipient.phone,
                    campaign.content,
                    campaign.senderNumber,
                  )
                : await strategy.sendMediaMessage(
                    recipient.phone,
                    campaign.mediaUrl!,
                    campaign.caption,
                    campaign.senderNumber,
                  );

            recipient.status = 'sent';
            await this.recorder.recordMessage({
              number: recipient.phone,
              campaignId: campaign.id,
              type: campaign.type,
              content: campaign.content,
              status: 'sent',
              errorMessage: null,
            });
          } catch (err) {
            recipient.status = 'failed';
            recipient.error = err.message;
            await this.recorder.recordMessage({
              number: recipient.phone,
              campaignId: campaign.id,
              type: campaign.type,
              content: campaign.content,
              status: 'failed',
              errorMessage: err.message,
            });
          }

          await this.contactRepo.save(recipient);
        }

        const failed = campaign.recipients.filter((r) => r.status === 'failed');
        campaign.status = failed.length === 0 ? 'completed' : 'failed';
        await this.campaignRepo.save(campaign);
        this.logger.log(`Campaign ${campaign.id} finished.`);
      } catch (err) {
        this.logger.error(
          `Failed to process campaign ${campaign.id}: ${err.message}`,
        );
      }
    }
  }
}

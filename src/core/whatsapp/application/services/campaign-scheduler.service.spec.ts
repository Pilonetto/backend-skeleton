import { Test, TestingModule } from '@nestjs/testing';
import { CampaignSchedulerService } from './campaign-scheduler.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Campaign } from '../../domain/entities/campaign.entity';
import { Repository } from 'typeorm';
import { WhatsappStrategyFactory } from '../../infrastructure/whatsapp.strategy.factory';
import { MessageRecorderService } from '../../application/services/message-recorder.service';
import { CampaignContact } from '../../domain/entities/campaign-contact.entity';

describe('CampaignSchedulerService', () => {
  let service: CampaignSchedulerService;
  let campaignRepo: Repository<Campaign>;
  let recorder: MessageRecorderService;
  let strategyFactory: WhatsappStrategyFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignSchedulerService,
        {
          provide: getRepositoryToken(CampaignContact),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Campaign),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: MessageRecorderService,
          useValue: {
            recordMessage: jest.fn(),
          },
        },
        {
          provide: WhatsappStrategyFactory,
          useValue: {
            create: jest.fn().mockReturnValue({
              sendTextMessage: jest.fn().mockResolvedValue({ ok: true }),
              sendMediaMessage: jest.fn().mockResolvedValue({ ok: true }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CampaignSchedulerService>(CampaignSchedulerService);
    campaignRepo = module.get(getRepositoryToken(Campaign));
    recorder = module.get(MessageRecorderService);
    strategyFactory = module.get(WhatsappStrategyFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute scheduled campaigns', async () => {
    const campaign = {
      id: 1,
      type: 'text',
      content: 'Hello',
      senderNumber: { provider: 'official' },
      recipients: [{ contact: { phone: '123' } }] as CampaignContact[],
    } as unknown as Campaign;

    jest.spyOn(campaignRepo, 'find').mockResolvedValue([campaign]);
    jest.spyOn(campaignRepo, 'save').mockResolvedValue(campaign);

    await service.executeScheduledCampaigns();

    expect(strategyFactory.create).toHaveBeenCalledWith(campaign.senderNumber);
    expect(recorder.recordMessage).toHaveBeenCalledWith({
      number: '123',
      campaignId: 1,
      type: 'text',
      content: 'Hello',
      status: 'success',
      errorMessage: null,
    });
  });
});

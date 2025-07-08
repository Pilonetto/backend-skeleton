import { CreateCampaignUseCase } from './create-campaign.use-case';
import { Repository } from 'typeorm';
import { Campaign } from '../../../domain/entities/campaign.entity';
import { SenderNumber } from 'src/core/whatsapp/domain/entities/sender-number.entity';
import { CampaignContact } from 'src/core/whatsapp/domain/entities/campaign-contact.entity';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';

// 🧪 Testa se o use-case cria e salva corretamente uma nova campanha no repositório
describe('CreateCampaignUseCase', () => {
  let useCase: CreateCampaignUseCase;
  let repo: jest.Mocked<Repository<Campaign>>;
  let senderRepo: jest.Mocked<Repository<SenderNumber>>;
  let contactRepo: jest.Mocked<Repository<CampaignContact>>;
  beforeEach(() => {
    repo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Campanha Teste',
        type: 'text',
        content: 'Olá! Esta é uma campanha de teste.',
        senderNumberId: 1,
        phones: ['5511999998888', '5511988887777'],
        scheduledAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
        mediaUrl: undefined,
        caption: undefined,
      }),
    } as any;

    senderRepo = {
      findOneBy: jest.fn().mockResolvedValue({ id: 1 }), // mock do sender encontrado
    } as any;

    contactRepo = {
      create: jest
        .fn()
        .mockImplementation(({ phone }) => ({ phone, status: 'pending' })),
    } as any;

    useCase = new CreateCampaignUseCase(repo, senderRepo, contactRepo);
  });

  it('should create and save a campaign', async () => {
    const dto: CreateCampaignDto = {
      id: 1,
      name: 'Campanha Teste',
      type: 'media',
      content: 'Olá! Esta é uma campanha de teste.',
      senderNumberId: 1,
      phones: ['5511999998888', '5511988887777'],
      scheduledAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
      mediaUrl: undefined,
      caption: undefined,
    };

    const result = await useCase.execute(dto);

    expect(senderRepo.findOneBy).toHaveBeenCalledWith({
      id: dto.senderNumberId,
    });
    expect(contactRepo.create).toHaveBeenCalledTimes(dto.phones.length);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 1);
  });
});

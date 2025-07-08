import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from './campaign.controller';
import { CreateCampaignUseCase } from '../../application/use-cases/campaigns/create-campaign.use-case';
import { CreateCampaignDto } from '../../application/dto/create-campaign.dto';

// 🧪 Este teste verifica se o controller chama corretamente o use-case ao criar uma campanha
describe('CampaignController', () => {
  let controller: CampaignController;
  let useCase: CreateCampaignUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignController],
      providers: [
        {
          provide: CreateCampaignUseCase,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'Campanha Teste' }),
          },
        },
      ],
    }).compile();

    controller = module.get(CampaignController);
    useCase = module.get(CreateCampaignUseCase);
  });

  it('should call use case and return created campaign', async () => {
    const dto: CreateCampaignDto = {
      name: 'Campanha Teste',
      type: 'text', // ou 'media'
      content: 'Olá! Esta é uma campanha de teste.',
      senderNumberId: 1,
      phones: ['5511999998888', '5511988887777'],
      scheduledAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(), // agendada para daqui 5 minutos
      mediaUrl: undefined, // incluir se for tipo 'media'
      caption: undefined, // incluir se for tipo 'media'
    };
    const result = await controller.create(dto);

    expect(useCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, name: 'Campanha Teste' });
  });
});

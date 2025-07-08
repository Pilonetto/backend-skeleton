import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { GetAllMessagesUseCase } from '../../application/use-cases/campaigns/get-all-messages.use-case';
// 🧪 Este teste verifica se o controller chama o use-case corretamente para retornar todas as mensagens
describe('MessageController', () => {
  let controller: MessageController;
  let useCase: GetAllMessagesUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: GetAllMessagesUseCase,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue([{ id: 1, content: 'Hello', type: 'text' }]),
          },
        },
      ],
    }).compile();

    controller = module.get(MessageController);
    useCase = module.get(GetAllMessagesUseCase);
  });

  it('should return all messages from use case', async () => {
    const result = await controller.findAll();

    expect(useCase.execute).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1, content: 'Hello', type: 'text' }]);
  });
});

import { WhatsappService } from './whatsapp.service';
import { SenderNumberSelectorService } from '../../application/services/sender-number-selector.service';
import { MessageRecorderService } from '../../application/services/message-recorder.service';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let selectorMock: jest.Mocked<SenderNumberSelectorService>;
  let recorderMock: jest.Mocked<MessageRecorderService>;

  beforeEach(() => {
    selectorMock = {
      getAvailableSender: jest.fn().mockResolvedValue({
        phoneNumber: '99999999',
        provider: 'unofficial',
      }),
      markSenderAsUsed: jest.fn(),
    } as any;

    recorderMock = {
      recordMessage: jest.fn().mockResolvedValue({ id: 1 }),
    } as any;

    service = new WhatsappService(selectorMock, recorderMock);
  });

  // 🧪 Este teste verifica se o envio de mensagem de texto usa a estratégia correta e grava no banco
  it('should send a text message and record it', async () => {
    const result = await service.sendText({ to: '123', message: 'hello' });
    expect(result).toHaveProperty('sender');
    expect(result.result.status).toContain('unofficial');
    expect(recorderMock.recordMessage).toHaveBeenCalled(); // gravação no banco testada
  });

  // 🧪 Este teste verifica se o método getStatus retorna o status da estratégia atual
  it('should get status', async () => {
    const result = await service.getStatus();
    expect(result).toContain('WhatsApp Strategy');
  });
});

import { DataSource } from 'typeorm';
import { SenderNumber } from '../../core/whatsapp/domain/entities/sender-number.entity';
import { Campaign } from '../../core/whatsapp/domain/entities/campaign.entity';
import { Contact } from '../../core/whatsapp/domain/entities/contact.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [SenderNumber, Campaign, Contact],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const senderRepo = AppDataSource.getRepository(SenderNumber);
  const campaignRepo = AppDataSource.getRepository(Campaign);
  const contactRepo = AppDataSource.getRepository(Contact);

  console.log('🚀 Limpando dados existentes...');
  await senderRepo.clear();
  await campaignRepo.clear();
  await contactRepo.clear();

  console.log('📲 Criando sender_numbers...');
  await senderRepo.save([
    {
      phoneNumber: '559999000001',
      provider: 'official',
      token: 'TEST_TOKEN_1',
      phoneNumberId: '123456789',
      cadenceInMs: 2000,
      active: true,
    },
    {
      phoneNumber: '559999000002',
      provider: 'unofficial',
      cadenceInMs: 4000,
      active: true,
    },
  ]);

  console.log('📣 Criando campanha de exemplo...');
  const campanha = campaignRepo.create({
    name: 'Black Friday',
    description: 'Descontos imperdíveis',
  });
  await campaignRepo.save(campanha);

  console.log('📇 Criando contatos de teste...');
  await contactRepo.save([
    { name: 'João Cliente', phone: '5511999991111', tags: ['vip', 'black'] },
    {
      name: 'Maria Compradora',
      phone: '5511988882222',
      tags: ['conveniência'],
    },
  ]);

  console.log('✅ Seeds finalizadas com sucesso!');
  process.exit(0);
}

seed();

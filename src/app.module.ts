import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './core/users/users.module';
import { WhatsappModule } from './core/whatsapp/whatsapp.module';
import { Contact } from './core/whatsapp/domain/entities/contact.entity';
import { SenderNumber } from './core/whatsapp/domain/entities/sender-number.entity';
import { Message } from './core/whatsapp/domain/entities/message.entity';
import { Campaign } from './core/whatsapp/domain/entities/campaign.entity';
import { CampaignContact } from './core/whatsapp/domain/entities/campaign-contact.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Contact, Campaign, Message, SenderNumber, CampaignContact],
      synchronize: true, // ❗ good for dev only
    }),
    UsersModule,
    WhatsappModule,
  ],
})
export class AppModule {}

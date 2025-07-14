// src/core/whatsapp/domain/entities/message.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { Contact } from './contact.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Campaign, { nullable: true })
  @JoinColumn()
  campaign: Campaign;

  @ManyToOne(() => Contact)
  @JoinColumn()
  contact: Contact;

  @Column()
  type: 'text' | 'media' | 'template';

  @Column()
  content: string;

  @Column({ nullable: true })
  caption?: string;

  @Column({ nullable: true })
  error?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  metaMessageId: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'success' | 'failed' | 'sent';

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ nullable: true })
  interaction?: string; // Saber mais, Não tenho interesse, Texto livre etc

  @Column({ nullable: true })
  interactionType?: 'button' | 'text' | 'read' | 'delivered' | 'failed';
}

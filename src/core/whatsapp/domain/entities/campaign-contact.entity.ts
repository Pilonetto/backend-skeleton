import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { Contact } from './contact.entity';

@Entity()
export class CampaignContact {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.recipients)
  campaign: Campaign;

  @ManyToOne(() => Contact, { eager: true })
  contact: Contact;

  @Column({
    type: 'text',
    default: 'pending',
  })
  status: 'pending' | 'sent' | 'failed' | 'read' | 'delivered' | 'success';

  @Column({ nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.senderNumber)
  campaigns: Campaign[];

  @Column()
  phone: string;

  @Column({ nullable: true })
  error?: string;

  @Column({ nullable: true })
  metaMessageId?: string;

  @Column({ nullable: true })
  interaction?: string; // Saber mais, Não tenho interesse, Texto livre etc

  @Column({ nullable: true })
  interactionType?: 'button' | 'text' | 'read' | 'delivered' | 'failed';
}

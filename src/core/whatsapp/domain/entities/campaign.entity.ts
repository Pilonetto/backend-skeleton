import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SenderNumber } from './sender-number.entity';
import { CampaignContact } from './campaign-contact.entity';

@Entity('campaign')
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', default: 'text' })
  type: 'text' | 'media';

  @Column({ nullable: true })
  mediaUrl?: string;

  @Column({ nullable: true })
  caption?: string;

  @Column({
    type: 'text',
    default: 'scheduled',
  })
  status: 'scheduled' | 'executing' | 'completed' | 'failed' | 'pending';

  @Column({ type: 'datetime', nullable: true })
  scheduledAt?: Date;

  @ManyToOne(() => SenderNumber, (sender) => sender.campaigns)
  senderNumber: SenderNumber;

  @OneToMany(() => CampaignContact, (cc) => cc.campaign, { cascade: true })
  recipients: CampaignContact[];

  @Column({
    type: 'text',
    default: '',
  })
  templateName?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

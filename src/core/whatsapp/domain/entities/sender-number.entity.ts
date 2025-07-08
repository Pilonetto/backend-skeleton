import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity('sender_numbers')
export class SenderNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  provider: 'official' | 'unofficial';

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  wabaId?: string;

  @Column({ nullable: true })
  phoneNumberId?: string;

  @Column({ type: 'int', default: 3000 })
  cadenceInMs: number;

  @Column({ type: 'datetime', nullable: true })
  lastSentAt?: Date;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.senderNumber)
  campaigns: Campaign[];
}

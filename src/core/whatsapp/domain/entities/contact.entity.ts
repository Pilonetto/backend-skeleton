// src/core/whatsapp/domain/entities/contact.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column('simple-array', { default: '' })
  tags: string[];
}

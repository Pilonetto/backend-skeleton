// src/core/whatsapp/application/use-cases/create-contact.use-case.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../../../domain/entities/contact.entity';
import { Repository } from 'typeorm';
import { CreateContactDto } from '../../dto/create-contact.dto';

@Injectable()
export class CreateContactUseCase {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async execute(dto: CreateContactDto) {
    const contact = this.contactRepo.create(dto);
    return this.contactRepo.save(contact);
  }
}

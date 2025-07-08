import { Body, Controller, Post } from '@nestjs/common';
import { CreateContactDto } from '../../application/dto/create-contact.dto';
import { CreateContactUseCase } from '../../application/use-cases/campaigns/create-contact.use-case';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly useCase: CreateContactUseCase) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Contact created' })
  async create(@Body() dto: CreateContactDto) {
    return this.useCase.execute(dto);
  }
}

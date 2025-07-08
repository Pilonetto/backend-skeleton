import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GetAllMessagesUseCase } from '../../application/use-cases/campaigns/get-all-messages.use-case';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly useCase: GetAllMessagesUseCase) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of sent messages' })
  async findAll() {
    return this.useCase.execute();
  }
}

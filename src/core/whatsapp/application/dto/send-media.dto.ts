import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMediaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  media: Buffer | string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  caption?: string;
}

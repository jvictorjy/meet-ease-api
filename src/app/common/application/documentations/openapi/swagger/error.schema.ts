import { ApiProperty } from '@nestjs/swagger';

export class ErrorSchema {
  @ApiProperty({ type: 'number' })
  code: number;

  @ApiProperty({ type: 'string' })
  error: string;

  @ApiProperty({ type: 'string' })
  message: string;

  @ApiProperty()
  details: Array<{ [key: string]: string | null }>;
}

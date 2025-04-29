import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class CreateAreaRequestDto {
  id?: string;

  @ApiProperty({
    type: 'string',
    description: 'Name of the area',
    example: faker.commerce.department(),
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Description of the area',
    example: faker.lorem.sentence(),
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: 'string',
    description: 'Parent area ID (for hierarchical structure)',
    example: faker.string.uuid(),
    required: false,
  })
  parent_id?: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class UpdateUserRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Name of the user',
    example: faker.person.fullName(),
  })
  name?: string;

  @ApiProperty({
    type: 'string',
    description: 'Email of the user',
    example: faker.internet.email(),
  })
  email?: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone number of the user',
    example: faker.phone.number(),
  })
  phone?: string;

  @ApiProperty({
    type: 'string',
    description: 'Area ID of the user',
    example: faker.string.uuid(),
  })
  area_id?: string;
}

export class UpdateUserResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'ID of the user',
    example: faker.string.uuid(),
  })
  id: string;

  @ApiProperty({
    type: 'string',
    description: 'Name of the user',
    example: faker.person.fullName(),
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Email of the user',
    example: faker.internet.email(),
  })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone number of the user',
    example: faker.phone.number(),
  })
  phone: string;

  @ApiProperty({
    type: 'string',
    description: 'Date when the user was created',
    example: faker.date.past().toISOString(),
  })
  created_at: Date;

  @ApiProperty({
    type: 'string',
    description: 'Date when the user was updated',
    example: faker.date.recent().toISOString(),
  })
  updated_at: Date;
}

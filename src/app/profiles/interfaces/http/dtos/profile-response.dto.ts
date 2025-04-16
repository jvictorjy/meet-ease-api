import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class CreateProfileDtoSwagger {
  id?: string;

  @ApiProperty({
    type: 'string',
    description: 'Role assigned to the profile',
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    type: 'string',
    description: 'Description of the profile',
    example: faker.lorem.paragraph(),
    nullable: true,
  })
  description?: string;
}

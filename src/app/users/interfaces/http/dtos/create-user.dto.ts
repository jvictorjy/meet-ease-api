import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class CreateUserRequestDto {
  id?: string;

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
    description: 'Password of the user',
    example: faker.internet.password(),
  })
  password: string;

  @ApiProperty({
    type: 'string',
    description: 'Confirm Password of the user',
    example: faker.internet.password(),
  })
  confirm_password: string;

  @ApiProperty({
    type: 'string',
    description: 'Role assigned to the user',
    example: faker.string.uuid(),
  })
  profile_id: string;

  @ApiProperty({
    type: 'string',
    description: 'Area assigned to the user',
    example: faker.string.uuid(),
  })
  area_id: string;
}

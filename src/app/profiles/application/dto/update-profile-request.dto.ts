import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

export class UpdateProfileRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Role assigned to the profile',
    example: faker.lorem.word({ strategy: 'longest' }),
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Role assigned to the profile',
    example: RoleName.ADMIN,
  })
  role: RoleName;

  @ApiProperty({
    type: 'string',
    description: 'Description of the profile',
    example: faker.lorem.paragraph(),
    nullable: true,
  })
  description?: string | null;
}

export class UpdateProfileResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'ID of the profile',
    example: faker.string.uuid(),
  })
  id: string;

  @ApiProperty({
    type: 'string',
    description: 'Role assigned to the profile',
    example: faker.lorem.word({ strategy: 'longest' }),
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Role assigned to the profile',
    example: RoleName.ADMIN,
  })
  role: RoleName;

  @ApiProperty({
    type: 'string',
    description: 'Description of the profile',
    example: faker.lorem.paragraph(),
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Date when the profile was created',
    example: faker.date.past(),
  })
  created_at: Date;

  @ApiProperty({
    type: 'string',
    description: 'Date when the profile was last updated',
    example: faker.date.recent(),
  })
  updated_at: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class ProfileResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Unique identifier of the profile',
    example: faker.string.uuid(),
  })
  id: string;

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
  description: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Date when the profile was created',
    example: faker.date.recent(),
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    description: 'Date when the profile was last updated',
    example: faker.date.recent(),
  })
  updatedAt: Date;

  constructor(
    id: string,
    role: string,
    description: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.role = role;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromEntity(profile: any): ProfileResponseDto {
    return new ProfileResponseDto(
      profile.id,
      profile.role,
      profile.description,
      profile.createdAt,
      profile.updatedAt,
    );
  }
}

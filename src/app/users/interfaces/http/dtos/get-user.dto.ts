import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { GetProfileUseCaseResponseDto } from '@app/profiles/interfaces/http/dtos/get-profile.dto';
import { GetAreaDto } from '@app/areas/interfaces/http/dtos/get-area.dto';

export class GetUserResponseDto {
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
    type: GetProfileUseCaseResponseDto,
    description: 'Profile of the user',
    example: GetProfileUseCaseResponseDto,
  })
  profile: GetProfileUseCaseResponseDto;

  @ApiProperty({
    type: GetAreaDto,
    description: 'Area of the user',
    example: GetAreaDto,
  })
  area: GetAreaDto;

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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class RoomLayoutResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the room layout',
    example: faker.string.uuid(),
  })
  id: string;

  @ApiPropertyOptional({
    description: 'The description of the room layout',
    example: faker.lorem.lines(),
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'The URL of the room layout image',
    example: faker.image.url(),
  })
  imageUrl: string;

  @ApiProperty({
    description: 'The ID of the room this layout belongs to',
    example: faker.string.uuid(),
  })
  roomId: string;

  @ApiProperty({
    description: 'The date when the room layout was created',
    example: faker.date.recent(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the room layout was last updated',
    example: faker.date.recent(),
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'The date when the room layout was deleted',
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;
}

export class CreateRoomLayoutDto {
  @ApiPropertyOptional({
    description: 'The description of the room layout',
    example: faker.lorem.lines(),
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'The URL of the room layout image',
    example: faker.image.url(),
  })
  imageUrl: string;
}

export class CreateRoomDto {
  @ApiProperty({
    type: String,
    description: 'The name of the room',
    example: faker.lorem.word(),
  })
  name: string;

  @ApiPropertyOptional({
    description: 'The description of the room',
    example: faker.lorem.lines(),
    nullable: true,
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The layout of the room',
    type: CreateRoomLayoutDto,
    nullable: true,
  })
  layout?: CreateRoomLayoutDto;
}

export class UpdateRoomDto {
  @ApiPropertyOptional({
    type: String,
    description: 'The name of the room',
    example: faker.lorem.word(),
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'The description of the room',
    example: faker.lorem.lines(),
    nullable: true,
  })
  description?: string;
}

export class RoomResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the room',
    example: faker.string.uuid(),
  })
  id: string;

  @ApiProperty({
    description: 'The name of the room',
    example: faker.lorem.word(),
  })
  name: string;

  @ApiPropertyOptional({
    description: 'The description of the room',
    example: faker.lorem.lines(),
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'The date when the room was created',
    example: faker.date.recent(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the room was last updated',
    example: faker.date.recent(),
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'The date when the room was deleted',
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiPropertyOptional({
    description: 'The layouts of the room',
    type: [RoomLayoutResponseDto],
    nullable: true,
  })
  layouts?: RoomLayoutResponseDto[];
}

export class AddRoomLayoutDto {
  @ApiProperty({
    description: 'The ID of the room this layout belongs to',
    example: faker.string.uuid(),
  })
  roomId: string;

  @ApiPropertyOptional({
    description: 'The description of the room layout',
    example: faker.lorem.lines(),
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'The URL of the room layout image',
    example: faker.image.url(),
  })
  imageUrl: string;
}

export class UpdateRoomLayoutDto {
  @ApiPropertyOptional({
    description: 'The description of the room layout',
    example: faker.lorem.lines(),
    nullable: true,
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The URL of the room layout image',
    example: faker.image.url(),
  })
  imageUrl?: string;
}

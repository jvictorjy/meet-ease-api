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
    type: 'string',
    format: 'binary',
    description: 'The file of the room layout image',
    example: faker.image.avatar(),
  })
  file: any;
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

  @ApiProperty({
    description: 'The maximum capacity of the room',
    example: 20,
    type: Number,
  })
  max_capacity: number;

  @ApiProperty({
    description: 'Opening time in HH:mm format',
    example: '08:00',
    type: String,
  })
  opening_time: string;

  @ApiProperty({
    description: 'Closing time in HH:mm format',
    example: '18:00',
    type: String,
  })
  closing_time: string;

  @ApiPropertyOptional({
    description: 'The layout of the room',
    type: [CreateRoomLayoutDto],
    nullable: true,
  })
  layouts?: CreateRoomLayoutDto[];
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
    description: 'The maximum capacity of the room',
    example: 20,
  })
  max_capacity: number;

  @ApiProperty({
    description: 'Opening time in HH:mm format',
    example: '08:00',
  })
  opening_time: string;

  @ApiProperty({
    description: 'Closing time in HH:mm format',
    example: '18:00',
  })
  closing_time: string;

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
}

export class RoomWithDetailsResponseDto extends RoomResponseDto {
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
    type: 'string',
    format: 'binary',
    description: 'The file of the room layout image',
    example: faker.image.avatar(),
  })
  imageUrl: any;
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

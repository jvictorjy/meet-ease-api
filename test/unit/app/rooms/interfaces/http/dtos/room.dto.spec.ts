import {
  RoomLayoutResponseDto,
  CreateRoomLayoutDto,
  CreateRoomDto,
  UpdateRoomDto,
  RoomResponseDto,
  AddRoomLayoutDto,
  UpdateRoomLayoutDto,
} from '@app/rooms/interfaces/http/dtos/room.dto';
import { plainToInstance } from 'class-transformer';

describe('RoomLayoutResponseDto', () => {
  it('should create a valid RoomLayoutResponseDto instance', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    const dto = new RoomLayoutResponseDto();
    dto.id = '123e4567-e89b-12d3-a456-426614174000';
    dto.description = 'Test Description';
    dto.imageUrl = 'https://example.com/image.jpg';
    dto.roomId = '123e4567-e89b-12d3-a456-426614174001';
    dto.createdAt = createdAt;
    dto.updatedAt = updatedAt;
    dto.deletedAt = null;

    expect(dto).toBeInstanceOf(RoomLayoutResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.description).toBe('Test Description');
    expect(dto.imageUrl).toBe('https://example.com/image.jpg');
    expect(dto.roomId).toBe('123e4567-e89b-12d3-a456-426614174001');
    expect(dto.createdAt).toBe(createdAt);
    expect(dto.updatedAt).toBe(updatedAt);
    expect(dto.deletedAt).toBeNull();
  });

  it('should create a RoomLayoutResponseDto from plain object', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    const plainObject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      description: 'Test Description',
      imageUrl: 'https://example.com/image.jpg',
      roomId: '123e4567-e89b-12d3-a456-426614174001',
      createdAt,
      updatedAt,
      deletedAt: null,
    };
    const dto = plainToInstance(RoomLayoutResponseDto, plainObject);

    expect(dto).toBeInstanceOf(RoomLayoutResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.description).toBe('Test Description');
    expect(dto.imageUrl).toBe('https://example.com/image.jpg');
    expect(dto.roomId).toBe('123e4567-e89b-12d3-a456-426614174001');
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.updatedAt).toBeInstanceOf(Date);
    expect(dto.deletedAt).toBeNull();
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new RoomLayoutResponseDto();

    expect(dto).toHaveProperty('id');
    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('imageUrl');
    expect(dto).toHaveProperty('roomId');
    expect(dto).toHaveProperty('createdAt');
    expect(dto).toHaveProperty('updatedAt');
    expect(dto).toHaveProperty('deletedAt');
  });
});

describe('CreateRoomLayoutDto', () => {
  it('should create a valid CreateRoomLayoutDto instance', () => {
    const dto = new CreateRoomLayoutDto();
    dto.description = 'Test Description';
    dto.imageUrl = 'https://example.com/image.jpg';

    expect(dto).toBeInstanceOf(CreateRoomLayoutDto);
    expect(dto.description).toBe('Test Description');
    expect(dto.imageUrl).toBe('https://example.com/image.jpg');
  });

  it('should create a CreateRoomLayoutDto from plain object', () => {
    const plainObject = {
      description: 'Test Description',
      imageUrl: 'https://example.com/image.jpg',
    };
    const dto = plainToInstance(CreateRoomLayoutDto, plainObject);

    expect(dto).toBeInstanceOf(CreateRoomLayoutDto);
    expect(dto.description).toBe('Test Description');
    expect(dto.imageUrl).toBe('https://example.com/image.jpg');
  });

  it('should create a CreateRoomLayoutDto with only required fields', () => {
    const plainObject = {
      imageUrl: 'https://example.com/image.jpg',
    };
    const dto = plainToInstance(CreateRoomLayoutDto, plainObject);

    expect(dto).toBeInstanceOf(CreateRoomLayoutDto);
    expect(dto.description).toBeUndefined();
    expect(dto.imageUrl).toBe('https://example.com/image.jpg');
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new CreateRoomLayoutDto();

    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('imageUrl');
  });
});

describe('CreateRoomDto', () => {
  it('should create a valid CreateRoomDto instance', () => {
    const layout = new CreateRoomLayoutDto();
    layout.description = 'Layout Description';
    layout.imageUrl = 'https://example.com/image.jpg';

    const dto = new CreateRoomDto();
    dto.name = 'Test Room';
    dto.description = 'Test Description';
    dto.layout = layout;

    expect(dto).toBeInstanceOf(CreateRoomDto);
    expect(dto.name).toBe('Test Room');
    expect(dto.description).toBe('Test Description');
    expect(dto.layout).toBe(layout);
  });

  it('should create a CreateRoomDto from plain object', () => {
    const plainObject = {
      name: 'Test Room',
      description: 'Test Description',
      layout: {
        description: 'Layout Description',
        imageUrl: 'https://example.com/image.jpg',
      },
    };
    const dto = plainToInstance(CreateRoomDto, plainObject);

    expect(dto).toBeInstanceOf(CreateRoomDto);
    expect(dto.name).toBe('Test Room');
    expect(dto.description).toBe('Test Description');
    expect(dto.layout).toBeDefined();
    expect(dto.layout?.description).toBe('Layout Description');
    expect(dto.layout?.imageUrl).toBe('https://example.com/image.jpg');
  });

  it('should create a CreateRoomDto with only required fields', () => {
    const plainObject = {
      name: 'Test Room',
    };
    const dto = plainToInstance(CreateRoomDto, plainObject);

    expect(dto).toBeInstanceOf(CreateRoomDto);
    expect(dto.name).toBe('Test Room');
    expect(dto.description).toBeUndefined();
    expect(dto.layout).toBeUndefined();
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new CreateRoomDto();

    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('layout');
  });
});

describe('UpdateRoomDto', () => {
  it('should create a valid UpdateRoomDto instance', () => {
    const dto = new UpdateRoomDto();
    dto.name = 'Updated Room';
    dto.description = 'Updated Description';

    expect(dto).toBeInstanceOf(UpdateRoomDto);
    expect(dto.name).toBe('Updated Room');
    expect(dto.description).toBe('Updated Description');
  });

  it('should create a UpdateRoomDto from plain object', () => {
    const plainObject = {
      name: 'Updated Room',
      description: 'Updated Description',
    };
    const dto = plainToInstance(UpdateRoomDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateRoomDto);
    expect(dto.name).toBe('Updated Room');
    expect(dto.description).toBe('Updated Description');
  });

  it('should create a UpdateRoomDto with partial fields', () => {
    const plainObject = {
      name: 'Updated Room',
    };
    const dto = plainToInstance(UpdateRoomDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateRoomDto);
    expect(dto.name).toBe('Updated Room');
    expect(dto.description).toBeUndefined();
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new UpdateRoomDto();

    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('description');
  });
});

describe('RoomResponseDto', () => {
  it('should create a valid RoomResponseDto instance', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    const layout = new RoomLayoutResponseDto();
    layout.id = '123e4567-e89b-12d3-a456-426614174002';
    layout.description = 'Layout Description';
    layout.imageUrl = 'https://example.com/image.jpg';
    layout.roomId = '123e4567-e89b-12d3-a456-426614174000';
    layout.createdAt = createdAt;
    layout.updatedAt = updatedAt;
    layout.deletedAt = null;

    const dto = new RoomResponseDto();
    dto.id = '123e4567-e89b-12d3-a456-426614174000';
    dto.name = 'Test Room';
    dto.description = 'Test Description';
    dto.createdAt = createdAt;
    dto.updatedAt = updatedAt;
    dto.deletedAt = null;
    dto.layouts = [layout];

    expect(dto).toBeInstanceOf(RoomResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.name).toBe('Test Room');
    expect(dto.description).toBe('Test Description');
    expect(dto.createdAt).toBe(createdAt);
    expect(dto.updatedAt).toBe(updatedAt);
    expect(dto.deletedAt).toBeNull();
    expect(dto.layouts).toHaveLength(1);
    expect(dto.layouts?.[0]).toBe(layout);
  });

  it('should create a RoomResponseDto from plain object', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    const plainObject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Room',
      description: 'Test Description',
      createdAt,
      updatedAt,
      deletedAt: null,
      layouts: [
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          description: 'Layout Description',
          imageUrl: 'https://example.com/image.jpg',
          roomId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt,
          updatedAt,
          deletedAt: null,
        },
      ],
    };
    const dto = plainToInstance(RoomResponseDto, plainObject);

    expect(dto).toBeInstanceOf(RoomResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.name).toBe('Test Room');
    expect(dto.description).toBe('Test Description');
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.updatedAt).toBeInstanceOf(Date);
    expect(dto.deletedAt).toBeNull();
    expect(dto.layouts).toHaveLength(1);
    expect(dto.layouts?.[0]).toBeDefined();
    expect(dto.layouts?.[0].id).toBe('123e4567-e89b-12d3-a456-426614174002');
    expect(dto.layouts?.[0].description).toBe('Layout Description');
    expect(dto.layouts?.[0].imageUrl).toBe('https://example.com/image.jpg');
    expect(dto.layouts?.[0].roomId).toBe(
      '123e4567-e89b-12d3-a456-426614174000',
    );
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new RoomResponseDto();

    expect(dto).toHaveProperty('id');
    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('createdAt');
    expect(dto).toHaveProperty('updatedAt');
    expect(dto).toHaveProperty('deletedAt');
    expect(dto).toHaveProperty('layouts');
  });
});

describe('AddRoomLayoutDto', () => {
  it('should create a valid AddRoomLayoutDto instance', () => {
    const dto = new AddRoomLayoutDto();
    dto.roomId = '123e4567-e89b-12d3-a456-426614174000';
    dto.description = 'Test Description';
    dto.imageUrl = 'https://example.com/image.jpg';

    expect(dto).toBeInstanceOf(AddRoomLayoutDto);
    expect(dto.roomId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.description).toBe('Test Description');
    expect(dto.imageUrl).toBe('https://example.com/image.jpg');
  });

  it('should create a AddRoomLayoutDto from plain object', () => {
    const plainObject = {
      roomId: '123e4567-e89b-12d3-a456-426614174000',
      description: 'Test Description',
      imageUrl: 'https://example.com/image.jpg',
    };
    const dto = plainToInstance(AddRoomLayoutDto, plainObject);

    expect(dto).toBeInstanceOf(AddRoomLayoutDto);
    expect(dto.roomId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.description).toBe('Test Description');
    expect(dto.imageUrl).toBe('https://example.com/image.jpg');
  });

  it('should create a AddRoomLayoutDto with only required fields', () => {
    const plainObject = {
      roomId: '123e4567-e89b-12d3-a456-426614174000',
      imageUrl: 'https://example.com/image.jpg',
    };
    const dto = plainToInstance(AddRoomLayoutDto, plainObject);

    expect(dto).toBeInstanceOf(AddRoomLayoutDto);
    expect(dto.roomId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.description).toBeUndefined();
    expect(dto.imageUrl).toBe('https://example.com/image.jpg');
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new AddRoomLayoutDto();

    expect(dto).toHaveProperty('roomId');
    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('imageUrl');
  });
});

describe('UpdateRoomLayoutDto', () => {
  it('should create a valid UpdateRoomLayoutDto instance', () => {
    const dto = new UpdateRoomLayoutDto();
    dto.description = 'Updated Description';
    dto.imageUrl = 'https://example.com/updated-image.jpg';

    expect(dto).toBeInstanceOf(UpdateRoomLayoutDto);
    expect(dto.description).toBe('Updated Description');
    expect(dto.imageUrl).toBe('https://example.com/updated-image.jpg');
  });

  it('should create a UpdateRoomLayoutDto from plain object', () => {
    const plainObject = {
      description: 'Updated Description',
      imageUrl: 'https://example.com/updated-image.jpg',
    };
    const dto = plainToInstance(UpdateRoomLayoutDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateRoomLayoutDto);
    expect(dto.description).toBe('Updated Description');
    expect(dto.imageUrl).toBe('https://example.com/updated-image.jpg');
  });

  it('should create a UpdateRoomLayoutDto with partial fields', () => {
    const plainObject = {
      description: 'Updated Description',
    };
    const dto = plainToInstance(UpdateRoomLayoutDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateRoomLayoutDto);
    expect(dto.description).toBe('Updated Description');
    expect(dto.imageUrl).toBeUndefined();
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new UpdateRoomLayoutDto();

    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('imageUrl');
  });
});

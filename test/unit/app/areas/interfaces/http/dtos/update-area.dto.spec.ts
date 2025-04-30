import { UpdateAreaRequestDto } from '@app/areas/interfaces/http/dtos/update-area.dto';
import { plainToInstance } from 'class-transformer';

describe('UpdateAreaRequestDto', () => {
  it('should create a valid UpdateAreaRequestDto instance', () => {
    const dto = new UpdateAreaRequestDto();
    dto.name = 'Updated Area';
    dto.description = 'Updated Description';
    dto.parent_id = '123e4567-e89b-12d3-a456-426614174000';

    expect(dto).toBeInstanceOf(UpdateAreaRequestDto);
    expect(dto.name).toBe('Updated Area');
    expect(dto.description).toBe('Updated Description');
    expect(dto.parent_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should create a UpdateAreaRequestDto from plain object', () => {
    const plainObject = {
      name: 'Updated Area',
      description: 'Updated Description',
      parent_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const dto = plainToInstance(UpdateAreaRequestDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateAreaRequestDto);
    expect(dto.name).toBe('Updated Area');
    expect(dto.description).toBe('Updated Description');
    expect(dto.parent_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should create a UpdateAreaRequestDto with partial fields', () => {
    const plainObject = {
      name: 'Updated Area',
    };
    const dto = plainToInstance(UpdateAreaRequestDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateAreaRequestDto);
    expect(dto.name).toBe('Updated Area');
    expect(dto.description).toBeUndefined();
    expect(dto.parent_id).toBeUndefined();
  });

  it('should create an empty UpdateAreaRequestDto', () => {
    const plainObject = {};
    const dto = plainToInstance(UpdateAreaRequestDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateAreaRequestDto);
    expect(dto.name).toBeUndefined();
    expect(dto.description).toBeUndefined();
    expect(dto.parent_id).toBeUndefined();
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    // This test verifies that the class has the expected structure
    // We can't directly test decorators, but we can check that the properties exist
    const dto = new UpdateAreaRequestDto();

    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('parent_id');
  });
});

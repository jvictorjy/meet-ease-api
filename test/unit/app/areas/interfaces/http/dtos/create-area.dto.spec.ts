import { CreateAreaRequestDto } from '@app/areas/interfaces/http/dtos/create-area.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateAreaRequestDto', () => {
  it('should create a valid CreateAreaRequestDto instance', () => {
    const dto = new CreateAreaRequestDto();
    dto.name = 'Test Area';
    dto.description = 'Test Description';
    dto.parent_id = '123e4567-e89b-12d3-a456-426614174000';

    expect(dto).toBeInstanceOf(CreateAreaRequestDto);
    expect(dto.name).toBe('Test Area');
    expect(dto.description).toBe('Test Description');
    expect(dto.parent_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should create a CreateAreaRequestDto from plain object', () => {
    const plainObject = {
      name: 'Test Area',
      description: 'Test Description',
      parent_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const dto = plainToInstance(CreateAreaRequestDto, plainObject);

    expect(dto).toBeInstanceOf(CreateAreaRequestDto);
    expect(dto.name).toBe('Test Area');
    expect(dto.description).toBe('Test Description');
    expect(dto.parent_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should create a CreateAreaRequestDto with only required fields', () => {
    const plainObject = {
      name: 'Test Area',
    };
    const dto = plainToInstance(CreateAreaRequestDto, plainObject);

    expect(dto).toBeInstanceOf(CreateAreaRequestDto);
    expect(dto.name).toBe('Test Area');
    expect(dto.description).toBeUndefined();
    expect(dto.parent_id).toBeUndefined();
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new CreateAreaRequestDto();

    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('parent_id');
  });
});

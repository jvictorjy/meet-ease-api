import { GetUserResponseDto } from '@app/users/interfaces/http/dtos/get-user.dto';
import { plainToInstance } from 'class-transformer';

describe('GetUserResponseDto', () => {
  it('should create a valid GetUserResponseDto instance', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    const dto = new GetUserResponseDto();
    dto.id = '123e4567-e89b-12d3-a456-426614174000';
    dto.name = 'John Doe';
    dto.email = 'john.doe@example.com';
    dto.phone = '1234567890';
    dto.created_at = createdAt;
    dto.updated_at = updatedAt;

    expect(dto).toBeInstanceOf(GetUserResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john.doe@example.com');
    expect(dto.phone).toBe('1234567890');
    expect(dto.created_at).toBe(createdAt);
    expect(dto.updated_at).toBe(updatedAt);
  });

  it('should create a GetUserResponseDto from plain object', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    const plainObject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      created_at: createdAt,
      updated_at: updatedAt,
    };
    const dto = plainToInstance(GetUserResponseDto, plainObject);

    expect(dto).toBeInstanceOf(GetUserResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john.doe@example.com');
    expect(dto.phone).toBe('1234567890');
    expect(dto.created_at).toBeInstanceOf(Date);
    expect(dto.updated_at).toBeInstanceOf(Date);
  });

  it('should create a GetUserResponseDto from plain object with string dates', () => {
    const plainObject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    };
    const dto = plainToInstance(GetUserResponseDto, plainObject);

    expect(dto).toBeInstanceOf(GetUserResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john.doe@example.com');
    expect(dto.phone).toBe('1234567890');
    expect(dto.created_at).toBe('2023-01-01T00:00:00Z');
    expect(dto.updated_at).toBe('2023-01-02T00:00:00Z');
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    // This test verifies that the class has the expected structure
    // We can't directly test decorators, but we can check that the properties exist
    const dto = new GetUserResponseDto();

    expect(dto).toHaveProperty('id');
    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('email');
    expect(dto).toHaveProperty('phone');
    expect(dto).toHaveProperty('created_at');
    expect(dto).toHaveProperty('updated_at');
  });
});

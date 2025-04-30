import { CreateUserRequestDto } from '@app/users/interfaces/http/dtos/create-user.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateUserRequestDto', () => {
  it('should create a valid CreateUserRequestDto instance', () => {
    const dto = new CreateUserRequestDto();
    dto.name = 'John Doe';
    dto.email = 'john.doe@example.com';
    dto.phone = '1234567890';
    dto.password = 'password123';
    dto.confirm_password = 'password123';
    dto.profile_id = '123e4567-e89b-12d3-a456-426614174000';

    expect(dto).toBeInstanceOf(CreateUserRequestDto);
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john.doe@example.com');
    expect(dto.phone).toBe('1234567890');
    expect(dto.password).toBe('password123');
    expect(dto.confirm_password).toBe('password123');
    expect(dto.profile_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should create a CreateUserRequestDto from plain object', () => {
    const plainObject = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      password: 'password123',
      confirm_password: 'password123',
      profile_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const dto = plainToInstance(CreateUserRequestDto, plainObject);

    expect(dto).toBeInstanceOf(CreateUserRequestDto);
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john.doe@example.com');
    expect(dto.phone).toBe('1234567890');
    expect(dto.password).toBe('password123');
    expect(dto.confirm_password).toBe('password123');
    expect(dto.profile_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should create a CreateUserRequestDto with optional id', () => {
    const plainObject = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      password: 'password123',
      confirm_password: 'password123',
      profile_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const dto = plainToInstance(CreateUserRequestDto, plainObject);

    expect(dto).toBeInstanceOf(CreateUserRequestDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174001');
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john.doe@example.com');
    expect(dto.phone).toBe('1234567890');
    expect(dto.password).toBe('password123');
    expect(dto.confirm_password).toBe('password123');
    expect(dto.profile_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new CreateUserRequestDto();

    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('email');
    expect(dto).toHaveProperty('phone');
    expect(dto).toHaveProperty('password');
    expect(dto).toHaveProperty('confirm_password');
    expect(dto).toHaveProperty('profile_id');
  });
});

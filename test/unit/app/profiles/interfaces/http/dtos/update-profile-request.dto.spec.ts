import {
  UpdateProfileRequestDto,
  UpdateProfileResponseDto,
} from '@app/profiles/interfaces/http/dtos/update-profile-request.dto';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { plainToInstance } from 'class-transformer';

describe('UpdateProfileRequestDto', () => {
  it('should create a valid UpdateProfileRequestDto instance', () => {
    const dto = new UpdateProfileRequestDto();
    dto.name = 'Updated Profile';
    dto.role = RoleName.ADMIN;
    dto.description = 'Updated Description';

    expect(dto).toBeInstanceOf(UpdateProfileRequestDto);
    expect(dto.name).toBe('Updated Profile');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBe('Updated Description');
  });

  it('should create a UpdateProfileRequestDto from plain object', () => {
    const plainObject = {
      name: 'Updated Profile',
      role: RoleName.ADMIN,
      description: 'Updated Description',
    };
    const dto = plainToInstance(UpdateProfileRequestDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateProfileRequestDto);
    expect(dto.name).toBe('Updated Profile');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBe('Updated Description');
  });

  it('should create a UpdateProfileRequestDto with null description', () => {
    const plainObject = {
      name: 'Updated Profile',
      role: RoleName.ADMIN,
      description: null,
    };
    const dto = plainToInstance(UpdateProfileRequestDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateProfileRequestDto);
    expect(dto.name).toBe('Updated Profile');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBeNull();
  });

  it('should support different role values', () => {
    const roles = [
      RoleName.ADMIN,
      RoleName.CORE,
      RoleName.LEADER,
      RoleName.SCHEDULER,
    ];

    roles.forEach((role) => {
      const dto = plainToInstance(UpdateProfileRequestDto, {
        name: 'Updated Profile',
        role,
      });

      expect(dto).toBeInstanceOf(UpdateProfileRequestDto);
      expect(dto.role).toBe(role);
    });
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    // This test verifies that the class has the expected structure
    // We can't directly test decorators, but we can check that the properties exist
    const dto = new UpdateProfileRequestDto();

    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('role');
    expect(dto).toHaveProperty('description');
  });
});

describe('UpdateProfileResponseDto', () => {
  it('should create a valid UpdateProfileResponseDto instance', () => {
    const created_at = new Date('2023-01-01T00:00:00Z');
    const updated_at = new Date('2023-01-02T00:00:00Z');

    const dto = new UpdateProfileResponseDto();
    dto.id = '123e4567-e89b-12d3-a456-426614174000';
    dto.name = 'Updated Profile';
    dto.role = RoleName.ADMIN;
    dto.description = 'Updated Description';
    dto.created_at = created_at;
    dto.updated_at = updated_at;

    expect(dto).toBeInstanceOf(UpdateProfileResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.name).toBe('Updated Profile');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBe('Updated Description');
    expect(dto.created_at).toBe(created_at);
    expect(dto.updated_at).toBe(updated_at);
  });

  it('should create a UpdateProfileResponseDto from plain object', () => {
    const created_at = new Date('2023-01-01T00:00:00Z');
    const updated_at = new Date('2023-01-02T00:00:00Z');

    const plainObject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Updated Profile',
      role: RoleName.ADMIN,
      description: 'Updated Description',
      created_at,
      updated_at,
    };
    const dto = plainToInstance(UpdateProfileResponseDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateProfileResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.name).toBe('Updated Profile');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBe('Updated Description');
    expect(dto.created_at).toBeInstanceOf(Date);
    expect(dto.updated_at).toBeInstanceOf(Date);
  });

  it('should create a UpdateProfileResponseDto with null description', () => {
    const created_at = new Date('2023-01-01T00:00:00Z');
    const updated_at = new Date('2023-01-02T00:00:00Z');

    const plainObject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Updated Profile',
      role: RoleName.ADMIN,
      description: null,
      created_at,
      updated_at,
    };
    const dto = plainToInstance(UpdateProfileResponseDto, plainObject);

    expect(dto).toBeInstanceOf(UpdateProfileResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.name).toBe('Updated Profile');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBeNull();
    expect(dto.created_at).toBeInstanceOf(Date);
    expect(dto.updated_at).toBeInstanceOf(Date);
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    // This test verifies that the class has the expected structure
    // We can't directly test decorators, but we can check that the properties exist
    const dto = new UpdateProfileResponseDto();

    expect(dto).toHaveProperty('id');
    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('role');
    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('created_at');
    expect(dto).toHaveProperty('updated_at');
  });
});

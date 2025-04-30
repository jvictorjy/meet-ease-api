import { GetProfileUseCaseResponseDto } from '@app/profiles/interfaces/http/dtos/get-profile.dto';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { plainToInstance } from 'class-transformer';

describe('GetProfileUseCaseResponseDto', () => {
  it('should create a valid GetProfileUseCaseResponseDto instance', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    const dto = new GetProfileUseCaseResponseDto();
    dto.id = '123e4567-e89b-12d3-a456-426614174000';
    dto.role = RoleName.ADMIN;
    dto.description = 'Test Description';
    dto.createdAt = createdAt;
    dto.updatedAt = updatedAt;

    expect(dto).toBeInstanceOf(GetProfileUseCaseResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBe('Test Description');
    expect(dto.createdAt).toBe(createdAt);
    expect(dto.updatedAt).toBe(updatedAt);
  });

  it('should create a GetProfileUseCaseResponseDto from plain object', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    const plainObject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      role: RoleName.ADMIN,
      description: 'Test Description',
      createdAt,
      updatedAt,
    };
    const dto = plainToInstance(GetProfileUseCaseResponseDto, plainObject);

    expect(dto).toBeInstanceOf(GetProfileUseCaseResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBe('Test Description');
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a GetProfileUseCaseResponseDto with null description', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    const plainObject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      role: RoleName.ADMIN,
      description: null,
      createdAt,
      updatedAt,
    };
    const dto = plainToInstance(GetProfileUseCaseResponseDto, plainObject);

    expect(dto).toBeInstanceOf(GetProfileUseCaseResponseDto);
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBeNull();
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.updatedAt).toBeInstanceOf(Date);
  });

  it('should support different role values', () => {
    const roles = [
      RoleName.ADMIN,
      RoleName.CORE,
      RoleName.LEADER,
      RoleName.SCHEDULER,
    ];
    const createdAt = new Date('2023-01-01T00:00:00Z');
    const updatedAt = new Date('2023-01-02T00:00:00Z');

    roles.forEach((role) => {
      const dto = plainToInstance(GetProfileUseCaseResponseDto, {
        id: '123e4567-e89b-12d3-a456-426614174000',
        role,
        createdAt,
        updatedAt,
      });

      expect(dto).toBeInstanceOf(GetProfileUseCaseResponseDto);
      expect(dto.role).toBe(role);
    });
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new GetProfileUseCaseResponseDto();

    expect(dto).toHaveProperty('id');
    expect(dto).toHaveProperty('role');
    expect(dto).toHaveProperty('description');
    expect(dto).toHaveProperty('createdAt');
    expect(dto).toHaveProperty('updatedAt');
  });
});

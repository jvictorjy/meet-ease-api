import { CreateProfileDto } from '@app/profiles/interfaces/http/dtos/create-profile.dto';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { plainToInstance } from 'class-transformer';

describe('CreateProfileDto', () => {
  it('should create a valid CreateProfileDto instance', () => {
    const dto = new CreateProfileDto();
    dto.name = 'Test Profile';
    dto.role = RoleName.ADMIN;
    dto.description = 'Test Description';

    expect(dto).toBeInstanceOf(CreateProfileDto);
    expect(dto.name).toBe('Test Profile');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBe('Test Description');
  });

  it('should create a CreateProfileDto from plain object', () => {
    const plainObject = {
      name: 'Test Profile',
      role: RoleName.ADMIN,
      description: 'Test Description',
    };
    const dto = plainToInstance(CreateProfileDto, plainObject);

    expect(dto).toBeInstanceOf(CreateProfileDto);
    expect(dto.name).toBe('Test Profile');
    expect(dto.role).toBe(RoleName.ADMIN);
    expect(dto.description).toBe('Test Description');
  });

  it('should create a CreateProfileDto with only required fields', () => {
    const plainObject = {
      name: 'Test Profile',
      role: RoleName.LEADER,
    };
    const dto = plainToInstance(CreateProfileDto, plainObject);

    expect(dto).toBeInstanceOf(CreateProfileDto);
    expect(dto.name).toBe('Test Profile');
    expect(dto.role).toBe(RoleName.LEADER);
    expect(dto.description).toBeUndefined();
  });

  it('should support different role values', () => {
    const roles = [
      RoleName.ADMIN,
      RoleName.CORE,
      RoleName.LEADER,
      RoleName.SCHEDULER,
    ];

    roles.forEach((role) => {
      const dto = plainToInstance(CreateProfileDto, {
        name: 'Test Profile',
        role,
      });

      expect(dto).toBeInstanceOf(CreateProfileDto);
      expect(dto.role).toBe(role);
    });
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new CreateProfileDto();

    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('role');
    expect(dto).toHaveProperty('description');
  });
});

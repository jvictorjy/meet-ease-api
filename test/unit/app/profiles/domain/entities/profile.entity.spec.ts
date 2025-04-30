import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('Profile Entity', () => {
  it('should create a valid profile', () => {
    const id = 'profile-id';
    const name = 'Test Profile';
    const description = 'Test Description';
    const role = 'user' as RoleName;
    const created_at = new Date();
    const updated_at = new Date();

    const profile = new Profile(
      id,
      name,
      description,
      role,
      created_at,
      updated_at,
    );

    expect(profile.id).toBe(id);
    expect(profile.name).toBe(name);
    expect(profile.description).toBe(description);
    expect(profile.role).toBe(role);
    expect(profile.createdAt).toBe(created_at);
    expect(profile.updatedAt).toBe(updated_at);
  });

  it('should create a valid profile with empty description', () => {
    const id = 'profile-id';
    const name = 'Test Profile';
    const description = '';
    const role = 'user' as RoleName;
    const created_at = new Date();
    const updated_at = new Date();

    const profile = new Profile(
      id,
      name,
      description,
      role,
      created_at,
      updated_at,
    );

    expect(profile.id).toBe(id);
    expect(profile.name).toBe(name);
    expect(profile.description).toBe(description);
    expect(profile.role).toBe(role);
    expect(profile.createdAt).toBe(created_at);
    expect(profile.updatedAt).toBe(updated_at);
  });

  it('should throw an error when id is not provided', () => {
    const id = '';
    const name = 'Test Profile';
    const description = 'Test Description';
    const role = 'user' as RoleName;
    const created_at = new Date();
    const updated_at = new Date();

    expect(() => {
      new Profile(id, name, description, role, created_at, updated_at);
    }).toThrow('Profile id is required');
  });

  it('should throw an error when name is not provided', () => {
    const id = 'profile-id';
    const name = '';
    const description = 'Test Description';
    const role = 'user' as RoleName;
    const created_at = new Date();
    const updated_at = new Date();

    expect(() => {
      new Profile(id, name, description, role, created_at, updated_at);
    }).toThrow('Profile name is required');
  });

  it('should throw an error when role is not provided', () => {
    const id = 'profile-id';
    const name = 'Test Profile';
    const description = 'Test Description';
    const role = '' as RoleName;
    const created_at = new Date();
    const updated_at = new Date();

    expect(() => {
      new Profile(id, name, description, role, created_at, updated_at);
    }).toThrow('Profile role is required');
  });
});

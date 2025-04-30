import { ProfileModel } from '@app/profiles/domain/models/profile.model';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('ProfileModel', () => {
  it('should create an instance with all properties', () => {
    const id = 'profile-id';
    const name = 'Test Profile';
    const description = 'Test Description';
    const role = 'user' as RoleName;
    const createdAt = new Date();
    const updatedAt = new Date();

    const profileModel: ProfileModel = {
      id,
      name,
      description,
      role,
      createdAt,
      updatedAt,
    };

    expect(profileModel).toBeDefined();
    expect(profileModel.id).toBe(id);
    expect(profileModel.name).toBe(name);
    expect(profileModel.description).toBe(description);
    expect(profileModel.role).toBe(role);
    expect(profileModel.createdAt).toBe(createdAt);
    expect(profileModel.updatedAt).toBe(updatedAt);
  });

  it('should create an instance with empty description', () => {
    const id = 'profile-id';
    const name = 'Test Profile';
    const description = '';
    const role = 'user' as RoleName;
    const createdAt = new Date();
    const updatedAt = new Date();

    const profileModel: ProfileModel = {
      id,
      name,
      description,
      role,
      createdAt,
      updatedAt,
    };

    // Assert
    expect(profileModel).toBeDefined();
    expect(profileModel.id).toBe(id);
    expect(profileModel.name).toBe(name);
    expect(profileModel.description).toBe(description);
    expect(profileModel.role).toBe(role);
    expect(profileModel.createdAt).toBe(createdAt);
    expect(profileModel.updatedAt).toBe(updatedAt);
  });

  it('should support different role types', () => {
    const adminProfile: ProfileModel = {
      id: 'admin-profile-id',
      name: 'Admin Profile',
      description: 'Admin Description',
      role: 'admin' as RoleName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userProfile: ProfileModel = {
      id: 'user-profile-id',
      name: 'User Profile',
      description: 'User Description',
      role: 'user' as RoleName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(adminProfile.role).toBe('admin');
    expect(userProfile.role).toBe('user');
  });
});

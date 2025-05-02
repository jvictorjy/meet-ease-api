import { UserModel } from '@app/users/domain/models/user.model';

describe('UserModel', () => {
  it('should create a valid UserModel instance', () => {
    const userModel = new UserModel();
    userModel.id = 'user-id';
    userModel.name = 'Test User';
    userModel.email = 'test@example.com';
    userModel.phone = '1234567890';
    userModel.profile = { id: 'profile-id', name: 'Test Profile' };
    userModel.createdAt = new Date();
    userModel.updatedAt = new Date();

    expect(userModel).toBeInstanceOf(UserModel);
    expect(userModel.id).toBe('user-id');
    expect(userModel.name).toBe('Test User');
    expect(userModel.email).toBe('test@example.com');
    expect(userModel.phone).toBe('1234567890');
    expect(userModel.profile).toEqual({
      id: 'profile-id',
      name: 'Test Profile',
    });
    expect(userModel.createdAt).toBeInstanceOf(Date);
    expect(userModel.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a UserModel with partial data', () => {
    const userModel = new UserModel();
    userModel.id = 'user-id';
    userModel.name = 'Test User';
    userModel.email = 'test@example.com';

    expect(userModel).toBeInstanceOf(UserModel);
    expect(userModel.id).toBe('user-id');
    expect(userModel.name).toBe('Test User');
    expect(userModel.email).toBe('test@example.com');
    expect(userModel.phone).toBeUndefined();
    expect(userModel.profile).toBeUndefined();
    expect(userModel.createdAt).toBeUndefined();
    expect(userModel.updatedAt).toBeUndefined();
  });

  it('should allow setting properties after creation', () => {
    const userModel = new UserModel();

    expect(userModel).toBeInstanceOf(UserModel);

    userModel.id = 'user-id';
    expect(userModel.id).toBe('user-id');

    userModel.name = 'Test User';
    expect(userModel.name).toBe('Test User');

    userModel.email = 'test@example.com';
    expect(userModel.email).toBe('test@example.com');

    userModel.phone = '1234567890';
    expect(userModel.phone).toBe('1234567890');

    userModel.profile = { id: 'profile-id', name: 'Test Profile' };
    expect(userModel.profile).toEqual({
      id: 'profile-id',
      name: 'Test Profile',
    });

    const createdAt = new Date();
    userModel.createdAt = createdAt;
    expect(userModel.createdAt).toBe(createdAt);

    const updatedAt = new Date();
    userModel.updatedAt = updatedAt;
    expect(userModel.updatedAt).toBe(updatedAt);
  });
});

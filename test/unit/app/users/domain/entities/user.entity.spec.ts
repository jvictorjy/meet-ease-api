import { User } from '@app/users/domain/entities/user.entity';

describe('User Entity', () => {
  it('should create a valid user', () => {
    const id = 'user-id';
    const name = 'Test User';
    const email = 'test@example.com';
    const phone = '1234567890';
    const password = 'password123';
    const profile_id = 'profile-id';
    const created_at = new Date();
    const updated_at = new Date();

    const user = new User(
      id,
      name,
      email,
      phone,
      password,
      profile_id,
      created_at,
      updated_at,
    );

    expect(user.id).toBe(id);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.phone).toBe(phone);
    expect(user.password).toBe(password);
    expect(user.profile_id).toBe(profile_id);
    expect(user.createdAt).toBe(created_at);
    expect(user.updatedAt).toBe(updated_at);
  });

  it('should throw an error when id is not provided', () => {
    const id = '';
    const name = 'Test User';
    const email = 'test@example.com';
    const phone = '1234567890';
    const password = 'password123';
    const profile_id = 'profile-id';
    const created_at = new Date();
    const updated_at = new Date();

    expect(() => {
      new User(
        id,
        name,
        email,
        phone,
        password,
        profile_id,
        created_at,
        updated_at,
      );
    }).toThrow('User id is required');
  });

  it('should throw an error when name is not provided', () => {
    const id = 'user-id';
    const name = '';
    const email = 'test@example.com';
    const phone = '1234567890';
    const password = 'password123';
    const profile_id = 'profile-id';
    const created_at = new Date();
    const updated_at = new Date();

    expect(() => {
      new User(
        id,
        name,
        email,
        phone,
        password,
        profile_id,
        created_at,
        updated_at,
      );
    }).toThrow('User name is required');
  });

  it('should throw an error when email is not provided', () => {
    const id = 'user-id';
    const name = 'Test User';
    const email = '';
    const phone = '1234567890';
    const password = 'password123';
    const profile_id = 'profile-id';
    const created_at = new Date();
    const updated_at = new Date();

    expect(() => {
      new User(
        id,
        name,
        email,
        phone,
        password,
        profile_id,
        created_at,
        updated_at,
      );
    }).toThrow('User email is required');
  });

  it('should throw an error when phone is not provided', () => {
    const id = 'user-id';
    const name = 'Test User';
    const email = 'test@example.com';
    const phone = '';
    const password = 'password123';
    const profile_id = 'profile-id';
    const created_at = new Date();
    const updated_at = new Date();

    expect(() => {
      new User(
        id,
        name,
        email,
        phone,
        password,
        profile_id,
        created_at,
        updated_at,
      );
    }).toThrow('User phone is required');
  });

  it('should throw an error when password is not provided', () => {
    const id = 'user-id';
    const name = 'Test User';
    const email = 'test@example.com';
    const phone = '1234567890';
    const password = '';
    const profile_id = 'profile-id';
    const created_at = new Date();
    const updated_at = new Date();

    expect(() => {
      new User(
        id,
        name,
        email,
        phone,
        password,
        profile_id,
        created_at,
        updated_at,
      );
    }).toThrow('User password is required');
  });

  it('should throw an error when profile_id is not provided', () => {
    const id = 'user-id';
    const name = 'Test User';
    const email = 'test@example.com';
    const phone = '1234567890';
    const password = 'password123';
    const profile_id = '';
    const created_at = new Date();
    const updated_at = new Date();

    expect(() => {
      new User(
        id,
        name,
        email,
        phone,
        password,
        profile_id,
        created_at,
        updated_at,
      );
    }).toThrow('User profile is required');
  });
});

import { User } from '@app/users/domain/entities/user.entity';

describe('User Entity', () => {
  it('updates the name when a valid new name is provided', () => {
    const user = new User(
      '1',
      'John Doe',
      'john@example.com',
      '1234567890',
      'password',
      'profile1',
      new Date(),
      new Date(),
    );
    user.updateName('Jane Doe');
    expect(user.name).toBe('Jane Doe');
  });

  it('throws an error when updating the name with an empty string', () => {
    const user = new User(
      '1',
      'John Doe',
      'john@example.com',
      '1234567890',
      'password',
      'profile1',
      new Date(),
      new Date(),
    );
    expect(() => user.updateName('')).toThrowError('Name cannot be empty');
  });

  it('throws an error when updating the name with a string containing only spaces', () => {
    const user = new User(
      '1',
      'John Doe',
      'john@example.com',
      '1234567890',
      'password',
      'profile1',
      new Date(),
      new Date(),
    );
    expect(() => user.updateName('   ')).toThrowError('Name cannot be empty');
  });

  it('does not throw an error when updating the name with a trimmed valid string', () => {
    const user = new User(
      '1',
      'John Doe',
      'john@example.com',
      '1234567890',
      'password',
      'profile1',
      new Date(),
      new Date(),
    );
    user.updateName('   Jane Doe   ');
    expect(user.name).toBe('Jane Doe');
  });
});

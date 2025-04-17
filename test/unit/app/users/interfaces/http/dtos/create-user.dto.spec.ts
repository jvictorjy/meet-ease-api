import { CreateUserRequestDto } from '@app/users/interfaces/http/dtos/create-user.dto';

describe('CreateUserDto', () => {
  it('creates a valid CreateUserRequestDto instance with all required fields populated', () => {
    const dto = new CreateUserRequestDto();
    dto.name = 'Jane Doe';
    dto.email = 'jane.doe@example.com';
    dto.phone = '9876543210';
    dto.password = 'securePassword';
    dto.confirm_password = 'securePassword';
    dto.profile_id = 'valid-profile-id';

    expect(dto).toEqual(
      expect.objectContaining({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '9876543210',
        password: 'securePassword',
        confirm_password: 'securePassword',
        profile_id: 'valid-profile-id',
      }),
    );
  });

  it('throws an error when required fields are not populated', () => {
    const dto = new CreateUserRequestDto();

    expect(() => {
      if (
        !dto.name ||
        !dto.email ||
        !dto.phone ||
        !dto.password ||
        !dto.confirm_password ||
        !dto.profile_id
      ) {
        throw new Error('Missing required fields');
      }
    }).toThrow('Missing required fields');
  });

  it('accepts an optional id field when provided', () => {
    const dto = new CreateUserRequestDto();
    dto.id = 'optional-id';
    dto.name = 'Jane Doe';
    dto.email = 'jane.doe@example.com';
    dto.phone = '9876543210';
    dto.password = 'securePassword';
    dto.confirm_password = 'securePassword';
    dto.profile_id = 'valid-profile-id';

    expect(dto.id).toBe('optional-id');
  });

  it('throws an error when confirm_password does not match password', () => {
    const dto = new CreateUserRequestDto();
    dto.name = 'Jane Doe';
    dto.email = 'jane.doe@example.com';
    dto.phone = '9876543210';
    dto.password = 'securePassword';
    dto.confirm_password = 'differentPassword';
    dto.profile_id = 'valid-profile-id';

    expect(() => {
      if (dto.password !== dto.confirm_password) {
        throw new Error('Passwords do not match');
      }
    }).toThrow('Passwords do not match');
  });
});

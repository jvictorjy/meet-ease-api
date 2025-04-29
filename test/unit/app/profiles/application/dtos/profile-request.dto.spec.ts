import { CreateProfileDtoSwagger } from '@app/profiles/interfaces/http/dtos/profile-request.dtos';

describe('CreateProfileDtoSwagger', () => {
  it('creates an instance with valid role and description', () => {
    const dto = new CreateProfileDtoSwagger();
    dto.role = 'admin';
    dto.description = 'This is a valid description';

    expect(dto.role).toBe('admin');
    expect(dto.description).toBe('This is a valid description');
  });

  it('creates an instance with a nullable description', () => {
    const dto = new CreateProfileDtoSwagger();
    dto.role = 'user';
    dto.description = null;

    expect(dto.role).toBe('user');
    expect(dto.description).toBeNull();
  });

  it('creates an instance with an undefined id', () => {
    const dto = new CreateProfileDtoSwagger();
    dto.role = 'admin';
    dto.description = 'Description';

    expect(dto.id).toBeUndefined();
  });

  it('handles empty string as a valid description', () => {
    const dto = new CreateProfileDtoSwagger();
    dto.role = 'admin';
    dto.description = '';

    expect(dto.description).toBe('');
  });
});

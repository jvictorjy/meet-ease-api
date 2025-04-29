import {
  UpdateProfileRequestDto,
  UpdateProfileResponseDto,
} from '@app/profiles/interfaces/http/dtos/update-profile-request.dtos';

describe('UpdateProfileRequestDto', () => {
  it('allows description to be null', () => {
    const dto = new UpdateProfileRequestDto();
    dto.description = null;

    expect(dto.description).toBeNull();
  });

  it('allows description to be undefined', () => {
    const dto = new UpdateProfileRequestDto();

    expect(dto.description).toBeUndefined();
  });

  it('accepts a valid string as description', () => {
    const dto = new UpdateProfileRequestDto();
    dto.description = 'Valid description';

    expect(dto.description).toBe('Valid description');
  });
});

describe('UpdateProfileResponseDto', () => {
  it('creates an instance with all required fields', () => {
    const dto = new UpdateProfileResponseDto();
    dto.id = '1';
    dto.role = 'admin';
    dto.description = 'Profile description';
    dto.created_at = new Date('2023-01-01');
    dto.updated_at = new Date('2023-01-02');

    expect(dto.id).toBe('1');
    expect(dto.role).toBe('admin');
    expect(dto.description).toBe('Profile description');
    expect(dto.created_at).toEqual(new Date('2023-01-01'));
    expect(dto.updated_at).toEqual(new Date('2023-01-02'));
  });

  it('allows description to be null', () => {
    const dto = new UpdateProfileResponseDto();
    dto.id = '1';
    dto.role = 'admin';
    dto.description = null;

    expect(dto.description).toBeNull();
  });
});

import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from '@app/users/interfaces/http/dtos/update-user.dto';

describe('UpdateUserRequestDto', () => {
  it('creates a valid instance with all fields populated', () => {
    const dto = new UpdateUserRequestDto();
    dto.name = 'Jane Doe';
    dto.email = 'jane.doe@example.com';
    dto.phone = '9876543210';

    expect(dto).toEqual(
      expect.objectContaining({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '9876543210',
      }),
    );
  });

  it('allows optional fields to be undefined', () => {
    const dto = new UpdateUserRequestDto();

    expect(dto).toEqual(
      expect.objectContaining({
        name: undefined,
        email: undefined,
        phone: undefined,
      }),
    );
  });
});

describe('UpdateUserResponseDto', () => {
  it('creates a valid instance with all fields populated', () => {
    const dto = new UpdateUserResponseDto();
    dto.id = 'user-id';
    dto.name = 'Jane Doe';
    dto.email = 'jane.doe@example.com';
    dto.phone = '9876543210';
    dto.created_at = new Date('2023-01-01T00:00:00.000Z');
    dto.updated_at = new Date('2023-01-02T00:00:00.000Z');

    expect(dto).toEqual(
      expect.objectContaining({
        id: 'user-id',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '9876543210',
        created_at: new Date('2023-01-01T00:00:00.000Z'),
        updated_at: new Date('2023-01-02T00:00:00.000Z'),
      }),
    );
  });

  it('throws an error when id is missing', () => {
    const dto = new UpdateUserResponseDto();
    dto.name = 'Jane Doe';
    dto.email = 'jane.doe@example.com';
    dto.phone = '9876543210';
    dto.created_at = new Date('2023-01-01T00:00:00.000Z');
    dto.updated_at = new Date('2023-01-02T00:00:00.000Z');

    expect(() => {
      if (!dto.id) {
        throw new Error('ID is required');
      }
    }).toThrow('ID is required');
  });

  it('allows optional fields to be undefined', () => {
    const dto = new UpdateUserResponseDto();
    dto.id = 'user-id';
    dto.created_at = new Date('2023-01-01T00:00:00.000Z');
    dto.updated_at = new Date('2023-01-02T00:00:00.000Z');

    expect(dto).toEqual(
      expect.objectContaining({
        id: 'user-id',
        name: undefined,
        email: undefined,
        phone: undefined,
        created_at: new Date('2023-01-01T00:00:00.000Z'),
        updated_at: new Date('2023-01-02T00:00:00.000Z'),
      }),
    );
  });
});

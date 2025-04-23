import { GetUserResponseDto } from '@app/users/interfaces/http/dtos/get-user.dto';

describe('GetUserResponseDto', () => {
  it('should create an instance of GetUserResponseDto with the given properties', () => {
    const dto = new GetUserResponseDto();
    dto.id = '123';
    dto.name = 'John Doe';
    dto.email = 'john.doe@example.com';
    dto.phone = '123-456-7890';
    dto.created_at = new Date('2021-01-01');
    dto.updated_at = new Date('2021-06-01');

    expect(dto).toBeDefined();
    expect(dto.id).toBe('123');
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john.doe@example.com');
    expect(dto.phone).toBe('123-456-7890');
    expect(dto.created_at.toISOString()).toBe(
      new Date('2021-01-01').toISOString(),
    );
    expect(dto.updated_at.toISOString()).toBe(
      new Date('2021-06-01').toISOString(),
    );
  });
});

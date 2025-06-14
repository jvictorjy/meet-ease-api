import {
  SignInDto,
  SignInResponseDto,
} from '@app/auth/interfaces/http/dtos/sign-in.dto';
import { plainToInstance } from 'class-transformer';

describe('SignInDto', () => {
  it('should create a valid SignInDto instance', () => {
    const dto = new SignInDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';

    expect(dto).toBeInstanceOf(SignInDto);
    expect(dto.email).toBe('test@example.com');
    expect(dto.password).toBe('password123');
  });

  it('should create a SignInDto from plain object', () => {
    const plainObject = {
      email: 'test@example.com',
      password: 'password123',
    };
    const dto = plainToInstance(SignInDto, plainObject);

    expect(dto).toBeInstanceOf(SignInDto);
    expect(dto.email).toBe('test@example.com');
    expect(dto.password).toBe('password123');
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    // This test verifies that the class has the expected structure
    // We can't directly test decorators, but we can check that the properties exist
    const dto = new SignInDto();

    expect(dto).toHaveProperty('email');
    expect(dto).toHaveProperty('password');
  });
});

describe('SignInResponseDto', () => {
  it('should create a valid SignInResponseDto instance', () => {
    const dto = new SignInResponseDto();
    dto.accessToken = 'valid-access-token';
    dto.refreshToken = 'valid-refresh-token';

    expect(dto).toBeInstanceOf(SignInResponseDto);
    expect(dto.accessToken).toBe('valid-access-token');
    expect(dto.refreshToken).toBe('valid-refresh-token');
  });

  it('should create a SignInResponseDto from plain object', () => {
    const plainObject = {
      accessToken: 'valid-access-token',
      refreshToken: 'valid-refresh-token',
    };
    const dto = plainToInstance(SignInResponseDto, plainObject);

    expect(dto).toBeInstanceOf(SignInResponseDto);
    expect(dto.accessToken).toBe('valid-access-token');
    expect(dto.refreshToken).toBe('valid-refresh-token');
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new SignInResponseDto();

    expect(dto).toHaveProperty('accessToken');
    expect(dto).toHaveProperty('refreshToken');
  });
});

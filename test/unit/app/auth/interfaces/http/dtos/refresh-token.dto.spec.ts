import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from '@app/auth/interfaces/http/dtos/refresh-token.dto';
import { plainToInstance } from 'class-transformer';

describe('RefreshTokenDto', () => {
  it('should create a valid RefreshTokenDto instance', () => {
    const dto = new RefreshTokenDto();
    dto.refreshToken = 'valid-refresh-token';

    expect(dto).toBeInstanceOf(RefreshTokenDto);
    expect(dto.refreshToken).toBe('valid-refresh-token');
  });

  it('should create a RefreshTokenDto from plain object', () => {
    const plainObject = { refreshToken: 'valid-refresh-token' };
    const dto = plainToInstance(RefreshTokenDto, plainObject);

    expect(dto).toBeInstanceOf(RefreshTokenDto);
    expect(dto.refreshToken).toBe('valid-refresh-token');
  });

  it('should have the correct property with ApiProperty decorator', () => {
    const dto = new RefreshTokenDto();

    expect(dto).toHaveProperty('refreshToken');
  });
});

describe('RefreshTokenResponseDto', () => {
  it('should create a valid RefreshTokenResponseDto instance', () => {
    const dto = new RefreshTokenResponseDto();
    dto.accessToken = 'valid-access-token';
    dto.refreshToken = 'valid-refresh-token';

    expect(dto).toBeInstanceOf(RefreshTokenResponseDto);
    expect(dto.accessToken).toBe('valid-access-token');
    expect(dto.refreshToken).toBe('valid-refresh-token');
  });

  it('should create a RefreshTokenResponseDto from plain object', () => {
    const plainObject = {
      accessToken: 'valid-access-token',
      refreshToken: 'valid-refresh-token',
    };
    const dto = plainToInstance(RefreshTokenResponseDto, plainObject);

    expect(dto).toBeInstanceOf(RefreshTokenResponseDto);
    expect(dto.accessToken).toBe('valid-access-token');
    expect(dto.refreshToken).toBe('valid-refresh-token');
  });

  it('should have the correct properties with ApiProperty decorators', () => {
    const dto = new RefreshTokenResponseDto();

    expect(dto).toHaveProperty('accessToken');
    expect(dto).toHaveProperty('refreshToken');
  });
});

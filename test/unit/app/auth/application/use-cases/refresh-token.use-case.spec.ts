import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { AuthService } from '@app/auth/application/services/auth.service';
import { RefreshTokenUseCase } from '@app/auth/application/use-cases/refresh-token.use-case';
import { RefreshTokenDto } from '@app/auth/interfaces/http/dtos/refresh-token.dto';

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    authService = {
      generateTokens: jest.fn(),
      verifyRefreshToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    refreshTokenUseCase = new RefreshTokenUseCase(authService);
  });

  it('throws an exception when refresh token is invalid', async () => {
    const data: RefreshTokenDto = {
      refreshToken: 'invalid-token',
    };

    jest.spyOn(authService, 'verifyRefreshToken').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(refreshTokenUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
  });

  it('throws an exception when payload is missing sub property', async () => {
    const data: RefreshTokenDto = {
      refreshToken: 'valid-token-without-sub',
    };

    jest.spyOn(authService, 'verifyRefreshToken').mockReturnValue({
      // Missing sub property
      exp: 1234567890,
    });

    await expect(refreshTokenUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.UNAUTHORIZED.code,
        overrideMessage: 'Invalid refresh token',
      }),
    );
  });

  it('returns new tokens when refresh token is valid', async () => {
    const data: RefreshTokenDto = {
      refreshToken: 'valid-token',
    };

    jest.spyOn(authService, 'verifyRefreshToken').mockReturnValue({
      sub: 'user-id',
      exp: 1234567890,
    });

    jest.spyOn(authService, 'generateTokens').mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    const result = await refreshTokenUseCase.execute(data);

    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    expect(authService.verifyRefreshToken).toHaveBeenCalledWith('valid-token');
    expect(authService.generateTokens).toHaveBeenCalledWith('user-id');
  });

  it('handles domain exceptions', async () => {
    const data: RefreshTokenDto = {
      refreshToken: 'valid-token',
    };

    jest.spyOn(authService, 'verifyRefreshToken').mockReturnValue({
      sub: 'user-id',
      exp: 1234567890,
    });

    jest.spyOn(authService, 'generateTokens').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'User not found',
      }),
    );

    await expect(refreshTokenUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'User not found',
      }),
    );
  });

  it('handles unexpected errors', async () => {
    const data: RefreshTokenDto = {
      refreshToken: 'valid-token',
    };

    jest.spyOn(authService, 'verifyRefreshToken').mockReturnValue({
      sub: 'user-id',
      exp: 1234567890,
    });

    jest
      .spyOn(authService, 'generateTokens')
      .mockRejectedValue(new Error('Database error'));

    await expect(refreshTokenUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
  });
});

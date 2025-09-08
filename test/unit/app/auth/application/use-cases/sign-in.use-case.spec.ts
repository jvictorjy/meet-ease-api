import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { HashComparer, Encrypter } from '@app/@common/application/cryptography';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { AuthService } from '@app/auth/application/services/auth.service';
import { SignInUseCase } from '@app/auth/application/use-cases/sign-in.use-case';
import { SignInDto } from '@app/auth/interfaces/http/dtos/sign-in.dto';
import { User } from '@app/users/domain/entities/user.entity';

describe('SignInUseCase', () => {
  let signInUseCase: SignInUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let hashComparer: jest.Mocked<HashComparer>;
  let encrypter: jest.Mocked<Encrypter>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      // other methods can be mocked if needed
    } as unknown as jest.Mocked<UserRepository>;

    hashComparer = {
      compare: jest.fn(),
    } as unknown as jest.Mocked<HashComparer>;

    encrypter = {
      encrypt: jest.fn(),
    } as unknown as jest.Mocked<Encrypter>;

    authService = {
      generateTokens: jest.fn(),
      verifyRefreshToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    signInUseCase = new SignInUseCase(
      userRepository,
      hashComparer,
      encrypter,
      authService,
    );
  });

  it('throws an exception when user is not found', async () => {
    const data: SignInDto = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    await expect(signInUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.UNAUTHORIZED.code,
        overrideMessage: 'Invalid credentials',
      }),
    );
  });

  it('throws an exception when password is invalid', async () => {
    const data: SignInDto = {
      email: 'user@example.com',
      password: 'wrongpassword',
    };

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValue(
        new User(
          'user-id',
          'Test User',
          'user@example.com',
          '1234567890',
          'hashedPassword',
          'profile-id',
          new Date(),
          new Date(),
        ),
      );

    jest.spyOn(hashComparer, 'compare').mockResolvedValue(false);

    await expect(signInUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.UNAUTHORIZED.code,
        overrideMessage: 'Invalid credentials',
      }),
    );
  });

  it('returns tokens when credentials are valid', async () => {
    const data: SignInDto = {
      email: 'user@example.com',
      password: 'correctpassword',
    };

    const mockUser = new User(
      'user-id',
      'Test User',
      'user@example.com',
      '1234567890',
      'hashedPassword',
      'profile-id',
      new Date(),
      new Date(),
    );

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(hashComparer, 'compare').mockResolvedValue(true);
    jest.spyOn(authService, 'generateTokens').mockResolvedValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { name: 'Test User', email: 'user@example.com' },
      profile: { name: 'Admin', role: 'ADMIN', description: 'desc' },
    });

    const result = await signInUseCase.execute(data);

    expect(result).toMatchObject({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(hashComparer.compare).toHaveBeenCalledWith(
      'correctpassword',
      'hashedPassword',
    );
    expect(authService.generateTokens).toHaveBeenCalledWith('user-id');
  });

  it('handles unexpected errors', async () => {
    const data: SignInDto = {
      email: 'user@example.com',
      password: 'password123',
    };

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockRejectedValue(new Error('Database error'));

    await expect(signInUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
  });
});

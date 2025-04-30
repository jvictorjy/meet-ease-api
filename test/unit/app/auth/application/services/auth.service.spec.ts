import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@app/auth/application/services/auth.service';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let profileRepository: jest.Mocked<ProfileRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'JwtService',
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: 'ConfigService',
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: 'ProfileRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get('JwtService');
    configService = module.get('ConfigService');
    profileRepository = module.get('ProfileRepository');
    userRepository = module.get('UserRepository');
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      // Mock user and profile
      const userId = 'test-user-id';
      const user = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890',
        profile: { id: 'test-profile-id' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const profile = {
        id: 'test-profile-id',
        name: 'Test Profile',
        role: RoleName.ADMIN,
        description: 'Test description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.findById.mockResolvedValue(user);
      profileRepository.findById.mockResolvedValue(profile);

      // Mock JWT service
      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      configService.get.mockImplementation((key) => {
        switch (key) {
          case 'JWT_SECRET':
            return 'test-secret';
          case 'JWT_EXPIRES_IN':
            return '24h';
          case 'JWT_REFRESH_SECRET':
            return 'refresh-secret';
          case 'JWT_REFRESH_EXPIRES_IN':
            return '7d';
          default:
            return undefined;
        }
      });

      // Call the method
      const result = await authService.generateTokens(userId);

      // Verify the result
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      // Verify that the repositories were called with the correct arguments
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(profileRepository.findById).toHaveBeenCalledWith(
        'test-profile-id',
      );

      // Verify that the JWT service was called with the correct arguments
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: userId,
          user: {
            name: user.name,
            email: user.email,
          },
          profile: {
            name: profile.name,
            role: profile.role,
            description: profile.description,
          },
        },
        {
          secret: 'test-secret',
          expiresIn: '24h',
        },
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: userId },
        {
          secret: 'refresh-secret',
          expiresIn: '7d',
        },
      );
    });

    it('should throw an exception when user is not found', async () => {
      // Mock user repository to return null
      userRepository.findById.mockResolvedValue(null);

      // Call the method and expect it to throw
      await expect(
        authService.generateTokens('non-existent-user-id'),
      ).rejects.toThrow(
        Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: 'User not found',
        }),
      );
    });

    it('should throw an exception when profile is not found', async () => {
      // Mock user and profile repositories
      const userId = 'test-user-id';
      const user = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890',
        profile: { id: 'test-profile-id' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.findById.mockResolvedValue(user);
      profileRepository.findById.mockResolvedValue(null);

      // Call the method and expect it to throw
      await expect(authService.generateTokens(userId)).rejects.toThrow(
        Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: 'Profile not found',
        }),
      );
    });

    it('should handle unexpected errors', async () => {
      // Mock user repository to throw an error
      userRepository.findById.mockRejectedValue(new Error('Database error'));

      // Call the method and expect it to throw
      await expect(authService.generateTokens('test-user-id')).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'An unexpected error occurred',
        }),
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a refresh token', () => {
      // Mock JWT service
      const payload = { sub: 'test-user-id', exp: 1234567890 };
      jwtService.verify.mockReturnValue(payload);

      // Mock config service
      configService.get.mockReturnValue('refresh-secret');

      // Call the method
      const result = authService.verifyRefreshToken('test-token');

      // Verify the result
      expect(result).toEqual(payload);

      // Verify that the JWT service was called with the correct arguments
      expect(jwtService.verify).toHaveBeenCalledWith('test-token', {
        secret: 'refresh-secret',
      });
    });

    it('should throw when token verification fails', () => {
      // Mock JWT service to throw
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Mock config service
      configService.get.mockReturnValue('refresh-secret');

      // Call the method and expect it to throw
      expect(() => authService.verifyRefreshToken('invalid-token')).toThrow(
        'Invalid token',
      );
    });
  });
});

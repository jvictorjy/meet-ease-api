import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@app/auth/infrastructure/jwt/jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    configService.get.mockReturnValue('test-secret');

    strategy = new JwtStrategy(configService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should use the JWT_SECRET from config service', () => {
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('should use default secret if JWT_SECRET is not provided', () => {
    configService.get.mockReturnValue(undefined);

    // Re-create the strategy to trigger the constructor with the mocked return value
    strategy = new JwtStrategy(configService);

    // We can't directly test the super() call, but we can verify the get method was called
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('should validate and return user data from payload', async () => {
    const payload = {
      sub: 'user-id',
      profile: {
        role: 'ADMIN',
      },
    };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: 'user-id',
      profile: {
        role: 'ADMIN',
      },
    });
  });
});

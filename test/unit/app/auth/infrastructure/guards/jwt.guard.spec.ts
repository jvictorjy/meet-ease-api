import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from '@app/auth/infrastructure/guards/jwt.guard';
import { IS_PUBLIC_KEY } from '@app/auth/infrastructure/jwt/public';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('JwtGuard', () => {
  let guard: JwtGuard;
  let reflector: jest.Mocked<Reflector>;
  let context: jest.Mocked<ExecutionContext>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new JwtGuard(reflector);

    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    } as unknown as jest.Mocked<ExecutionContext>;
  });

  it('should allow access to public routes', () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('should throw an exception when no token is provided', () => {
    reflector.getAllAndOverride.mockReturnValue(false);

    const httpContext = {
      getRequest: jest.fn().mockReturnValue({
        headers: {},
      }),
    };

    context.switchToHttp.mockReturnValue(httpContext as any);

    expect(() => guard.canActivate(context)).toThrow(
      Exception.new({
        code: Code.UNAUTHORIZED.code,
        overrideMessage: 'No token provided',
      }),
    );

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('should not throw an exception when token is provided', () => {
    reflector.getAllAndOverride.mockReturnValue(false);

    const httpContext = {
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer valid-token',
        },
      }),
    };

    context.switchToHttp.mockReturnValue(httpContext as any);

    // Mock the super.canActivate method to return true
    const originalPrototype = Object.getPrototypeOf(JwtGuard.prototype);
    const originalCanActivate = originalPrototype.canActivate;
    originalPrototype.canActivate = jest.fn().mockReturnValue(true);

    try {
      // This should not throw an exception
      const result = guard.canActivate(context);

      // Verify the reflector was called with the correct parameters
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      // Since we've mocked the parent's canActivate to return true, our result should be true
      expect(result).toBe(true);
    } finally {
      // Restore the original method
      originalPrototype.canActivate = originalCanActivate;
    }
  });
});

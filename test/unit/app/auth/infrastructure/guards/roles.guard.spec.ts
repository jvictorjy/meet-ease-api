import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '@app/auth/infrastructure/guards/roles.guard';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let context: jest.Mocked<ExecutionContext>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new RolesGuard(reflector);

    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    } as unknown as jest.Mocked<ExecutionContext>;
  });

  it('should allow access when no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue(null);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('should allow access when user has a required role', () => {
    reflector.getAllAndOverride.mockReturnValue([
      RoleName.ADMIN,
      RoleName.LEADER,
    ]);

    const httpContext = {
      getRequest: jest.fn().mockReturnValue({
        user: {
          profile: {
            role: RoleName.ADMIN,
          },
        },
      }),
    };

    context.switchToHttp.mockReturnValue(httpContext as any);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('should deny access when user does not have a required role', () => {
    reflector.getAllAndOverride.mockReturnValue([
      RoleName.ADMIN,
      RoleName.LEADER,
    ]);

    const httpContext = {
      getRequest: jest.fn().mockReturnValue({
        user: {
          profile: {
            role: RoleName.SCHEDULER,
          },
        },
      }),
    };

    context.switchToHttp.mockReturnValue(httpContext as any);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('should deny access when user has no profile', () => {
    reflector.getAllAndOverride.mockReturnValue([
      RoleName.ADMIN,
      RoleName.LEADER,
    ]);

    const httpContext = {
      getRequest: jest.fn().mockReturnValue({
        user: {},
      }),
    };

    context.switchToHttp.mockReturnValue(httpContext as any);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('should deny access when there is no user', () => {
    reflector.getAllAndOverride.mockReturnValue([
      RoleName.ADMIN,
      RoleName.LEADER,
    ]);

    const httpContext = {
      getRequest: jest.fn().mockReturnValue({}),
    };

    context.switchToHttp.mockReturnValue(httpContext as any);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  });
});

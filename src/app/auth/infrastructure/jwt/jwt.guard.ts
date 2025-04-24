import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@app/auth/infrastructure/jwt/public';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw Exception.new({
        code: Code.UNAUTHORIZED.code,
        overrideMessage: 'No token provided',
      });
    }

    return super.canActivate(context);
  }
}

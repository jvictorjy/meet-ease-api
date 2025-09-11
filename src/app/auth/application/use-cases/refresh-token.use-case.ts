import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { AuthService } from '@app/auth/application/services/auth.service';
import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from '@app/auth/interfaces/http/dtos/refresh-token.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('AuthService')
    private readonly authService: AuthService,
  ) {}

  async execute({
    refreshToken,
  }: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    try {
      const payload = this.authService.verifyRefreshToken(refreshToken);
      console.log(payload);
      if (!payload || !payload.sub) {
        throw Exception.new({
          code: Code.UNAUTHORIZED.code,
          overrideMessage: 'Invalid refresh token',
        });
      }

      return await this.authService.generateTokens(payload.sub);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      });
    }
  }
}

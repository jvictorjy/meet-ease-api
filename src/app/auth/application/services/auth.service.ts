import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { UserRepository } from '@app/users/domain/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject('JwtService')
    private readonly jwtService: JwtService,

    @Inject('ConfigService')
    private readonly configService: ConfigService,

    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,

    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async generateToken(userId: string, profileId: string): Promise<string> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: 'User not found',
        });
      }

      const profile = await this.profileRepository.findById(profileId);

      if (!profile) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: 'Profile not found',
        });
      }

      // Create payload with user and profile data
      const payload = {
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
      };

      return this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h'),
      });
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

  verifyToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}

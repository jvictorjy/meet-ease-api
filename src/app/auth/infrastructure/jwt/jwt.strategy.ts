import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';

const configService = new ConfigService<EnvironmentVariables, true>(
  ConfigService,
);

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const publicKey = configService.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}

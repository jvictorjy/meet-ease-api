import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Encrypter } from '@app/@common/application/cryptography';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}

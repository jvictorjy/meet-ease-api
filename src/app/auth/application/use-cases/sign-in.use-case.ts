import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import {
  SignInDto,
  SignInResponseDto,
} from '@app/auth/interfaces/http/dtos/sign-in.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { Encrypter, HashComparer } from '@app/@common/application/cryptography';

@Injectable()
export class SignInUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('HashComparer')
    private readonly hashComparer: HashComparer,

    @Inject('Encrypter')
    private readonly encrypter: Encrypter,
  ) {}

  async execute({ email, password }: SignInDto): Promise<SignInResponseDto> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `User or password invalid`,
        });
      }

      const isPasswordValid = await this.hashComparer.compare(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw Exception.new({
          code: Code.UNAUTHORIZED.code,
          overrideMessage: `User or password invalid`,
        });
      }

      const accessToken = await this.encrypter.encrypt({
        sub: user.id.toString(),
      });

      return {
        accessToken,
      };
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

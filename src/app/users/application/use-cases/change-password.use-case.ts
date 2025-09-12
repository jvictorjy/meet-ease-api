import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { HashGenerator } from '@app/@common/application/cryptography';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('HashGenerator')
    private readonly hashProvider: HashGenerator,
  ) {}

  async execute(userId: string, password: string): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: 'User not found',
        });
      }

      const hashed = await this.hashProvider.hash(password);

      await this.userRepository.update({ id: user.id, password: hashed });
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

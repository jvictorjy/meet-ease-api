import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import {
  HashComparer,
  HashGenerator,
} from '@app/@common/application/cryptography';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ChangePasswordRequestDto } from '@app/users/interfaces/http/dtos/change-password.dto';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('HashGenerator')
    private readonly hashProvider: HashGenerator,

    @Inject('HashComparer')
    private readonly hashComparer: HashComparer,
  ) {}

  async execute(userId: string, dto: ChangePasswordRequestDto): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: 'User not found',
        });
      }

      const isValid = await this.hashComparer.compare(
        dto.current_password,
        user.password,
      );

      if (!isValid) {
        throw Exception.new({
          code: Code.BAD_REQUEST.code,
          overrideMessage:
            'An error occurred while trying to change the password.',
        });
      }

      const hashed = await this.hashProvider.hash(dto.password);

      await this.userRepository.updatePassword(user.id, hashed);
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

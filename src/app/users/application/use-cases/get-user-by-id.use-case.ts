import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { GetUserResponseDto } from '@app/users/interfaces/http/dtos/get-user.dto';
import { UserModel } from '@app/users/domain/models/user.model';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<UserModel> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: 'User not found',
        });
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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

import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@app/users/domain/entities/user.entity';
import { UpdateUserRequestDto } from '@app/users/interfaces/http/dtos/update-user.dto';
import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    payload: UpdateUserRequestDto,
  ): Promise<Partial<User>> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `User not found`,
        });
      }

      const updatedUser = { ...user, ...payload };

      const userUpdated = await this.userRepository.update(updatedUser);

      return {
        id: userUpdated.id,
        name: userUpdated.name,
        email: userUpdated.email,
        phone: userUpdated.phone,
        profile_id: userUpdated.profile_id,
        created_at: userUpdated.created_at,
        updated_at: userUpdated.updated_at,
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

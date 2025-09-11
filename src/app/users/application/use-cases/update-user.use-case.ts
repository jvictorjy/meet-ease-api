import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserRequestDto } from '@app/users/interfaces/http/dtos/update-user.dto';
import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { AreaRepository } from '@app/areas/domain/repositories/area.repository';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,

    @Inject('AreaRepository')
    private readonly areaRepository: AreaRepository,
  ) {}

  async execute(userId: string, payload: UpdateUserRequestDto): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `User not found`,
        });
      }

      if (payload.area_id) {
        const area = await this.areaRepository.findById(payload.area_id);

        if (!area) {
          throw Exception.new({
            code: Code.NOT_FOUND.code,
            overrideMessage: `Area not found`,
          });
        }
      }

      const updatedUser = { id: user.id, ...payload };

      await this.userRepository.update(updatedUser);
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

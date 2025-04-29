import { AreaRepository } from '@app/areas/domain/repositories/area.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class DeleteAreaUseCase {
  constructor(
    @Inject('AreaRepository')
    private readonly areaRepository: AreaRepository,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const areaExists = await this.areaRepository.findById(id);

      if (!areaExists) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Area not found`,
        });
      }

      await this.areaRepository.delete(id);
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

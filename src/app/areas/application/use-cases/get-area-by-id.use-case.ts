import { AreaRepository } from '@app/areas/domain/repositories/area.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { AreaModel } from '@app/areas/domain/models/area.model';

@Injectable()
export class GetAreaByIdUseCase {
  constructor(
    @Inject('AreaRepository')
    private readonly areaRepository: AreaRepository,
  ) {}

  async execute(id: string): Promise<AreaModel> {
    try {
      const area = await this.areaRepository.findById(id);

      if (!area) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Area not found`,
        });
      }

      return area;
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

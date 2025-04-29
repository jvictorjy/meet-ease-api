import {
  AreaRepository,
  AreaUpdatePayload,
} from '@app/areas/domain/repositories/area.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { AreaModel } from '@app/areas/domain/models/area.model';

@Injectable()
export class UpdateAreaUseCase {
  constructor(
    @Inject('AreaRepository')
    private readonly areaRepository: AreaRepository,
  ) {}

  async execute(id: string, data: AreaUpdatePayload): Promise<AreaModel> {
    try {
      const { parent_id } = data;

      const areaExists = await this.areaRepository.findById(id);

      if (!areaExists) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Area not found`,
        });
      }

      if (parent_id) {
        if (parent_id === id) {
          throw Exception.new({
            code: Code.BAD_REQUEST.code,
            overrideMessage: `Area cannot be its own parent`,
          });
        }

        const parentExists = await this.areaRepository.findById(parent_id);

        if (!parentExists) {
          throw Exception.new({
            code: Code.NOT_FOUND.code,
            overrideMessage: `Parent area not found`,
          });
        }
      }

      return this.areaRepository.update(id, data);
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

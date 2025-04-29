import { AreaRepository } from '@app/areas/domain/repositories/area.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { AreaModel } from '@app/areas/domain/models/area.model';

@Injectable()
export class GetAllAreasUseCase {
  constructor(
    @Inject('AreaRepository')
    private readonly areaRepository: AreaRepository,
  ) {}

  async execute(): Promise<AreaModel[]> {
    try {
      return this.areaRepository.findAll();
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

import { v4 as uuid } from 'uuid';
import { AreaRepository } from '@app/areas/domain/repositories/area.repository';
import { Area } from '@app/areas/domain/entities/area.entity';
import { CreateAreaRequestDto } from '@app/areas/interfaces/http/dtos/create-area.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class CreateAreaUseCase {
  constructor(
    @Inject('AreaRepository')
    private readonly areaRepository: AreaRepository,
  ) {}

  async execute(data: CreateAreaRequestDto): Promise<void> {
    try {
      const { name, description, parent_id } = data;

      // If parent_id is provided, check if parent exists
      if (parent_id) {
        const parentExists = await this.areaRepository.findById(parent_id);

        if (!parentExists) {
          throw Exception.new({
            code: Code.NOT_FOUND.code,
            overrideMessage: `Parent area not found`,
          });
        }
      }

      const area = new Area(
        uuid(),
        name,
        description || null,
        parent_id || null,
        new Date(),
        new Date(),
        null,
      );

      await this.areaRepository.create({
        name: area.name,
        description: area.description || undefined,
        parent_id: area.parent_id || undefined,
      });
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

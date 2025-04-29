import { PrismaClient } from '@prisma/client';
import { Area } from '@app/areas/domain/entities/area.entity';
import {
  AreaRepository,
  AreaUpdatePayload,
} from '@app/areas/domain/repositories/area.repository';
import { AreaAggregateMapper } from '@app/areas/domain/mappers/area-aggregate.mapper';
import { AreaModel } from '@app/areas/domain/models/area.model';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class PrismaAreaRepository implements AreaRepository {
  private readonly prisma = new PrismaClient();

  constructor(
    @Inject('AreaAggregateMapper')
    private readonly areaMapper: AreaAggregateMapper,
  ) {}

  async create(
    areaData: Omit<
      AreaModel,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'parent' | 'children'
    >,
  ): Promise<AreaModel> {
    try {
      const area = await this.prisma.area.create({
        data: {
          name: areaData.name,
          description: areaData.description || null,
          parent_id: areaData.parent_id || null,
        },
      });

      return this.areaMapper.mapToAggregate(
        new Area(
          area.id,
          area.name,
          area.description,
          area.parent_id,
          area.created_at,
          area.updated_at,
          area.deleted_at,
        ),
      );
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async update(id: string, areaData: AreaUpdatePayload): Promise<AreaModel> {
    try {
      const area = await this.prisma.area.update({
        where: { id },
        data: {
          name: areaData.name,
          description: areaData.description,
          parent_id: areaData.parent_id,
          updated_at: new Date(),
        },
      });

      return this.areaMapper.mapToAggregate(
        new Area(
          area.id,
          area.name,
          area.description,
          area.parent_id,
          area.created_at,
          area.updated_at,
          area.deleted_at,
        ),
      );
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findById(id: string): Promise<AreaModel | null> {
    try {
      const areaData = await this.prisma.area.findUnique({
        where: { id },
        include: {
          parent: true,
          children: true,
        },
      });

      if (!areaData) {
        return null;
      }

      const area = new Area(
        areaData.id,
        areaData.name,
        areaData.description,
        areaData.parent_id,
        areaData.created_at,
        areaData.updated_at,
        areaData.deleted_at,
      );

      const areaModel = await this.areaMapper.mapToAggregate(area);

      // Add parent and children if available
      if (areaData.parent) {
        areaModel.parent = await this.areaMapper.mapToAggregate(
          new Area(
            areaData.parent.id,
            areaData.parent.name,
            areaData.parent.description,
            areaData.parent.parent_id,
            areaData.parent.created_at,
            areaData.parent.updated_at,
            areaData.parent.deleted_at,
          ),
        );
      }

      if (areaData.children && areaData.children.length > 0) {
        areaModel.children = await this.areaMapper.mapCollection(
          areaData.children.map(
            (child) =>
              new Area(
                child.id,
                child.name,
                child.description,
                child.parent_id,
                child.created_at,
                child.updated_at,
                child.deleted_at,
              ),
          ),
        );
      }

      return areaModel;
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findAll(): Promise<AreaModel[]> {
    try {
      const areasData = await this.prisma.area.findMany({
        where: {
          deleted_at: null,
        },
      });

      return this.areaMapper.mapCollection(
        areasData.map(
          (area) =>
            new Area(
              area.id,
              area.name,
              area.description,
              area.parent_id,
              area.created_at,
              area.updated_at,
              area.deleted_at,
            ),
        ),
      );
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.area.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }
}

import { PrismaAreaRepository } from '@app/areas/infrastructure/persistence/prisma-area.repository';
import { AreaAggregateMapper } from '@app/areas/domain/mappers/area-aggregate.mapper';
import { Area } from '@app/areas/domain/entities/area.entity';
import { AreaModel } from '@app/areas/domain/models/area.model';
import { PrismaClient } from '@prisma/client';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    area: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('PrismaAreaRepository', () => {
  let prismaAreaRepository: PrismaAreaRepository;
  let areaMapper: jest.Mocked<AreaAggregateMapper>;
  let prismaClient: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock AreaAggregateMapper
    areaMapper = {
      mapToAggregate: jest.fn(),
      mapCollection: jest.fn(),
    } as unknown as jest.Mocked<AreaAggregateMapper>;

    // Create repository instance
    prismaAreaRepository = new PrismaAreaRepository(areaMapper);

    // Get the mocked PrismaClient instance
    prismaClient = (PrismaClient as jest.Mock).mock.results[0].value;
  });

  describe('create', () => {
    it('should create an area and return the mapped result', async () => {
      // Arrange
      const areaData = {
        name: 'Test Area',
        description: 'Test Description',
        parent_id: 'parent-id',
      };

      const createdPrismaArea = {
        id: 'area-id',
        name: 'Test Area',
        description: 'Test Description',
        parent_id: 'parent-id',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      const expectedAreaModel: AreaModel = {
        id: 'area-id',
        name: 'Test Area',
        description: 'Test Description',
        parent_id: 'parent-id',
        createdAt: createdPrismaArea.created_at,
        updatedAt: createdPrismaArea.updated_at,
      };

      prismaClient.area.create.mockResolvedValue(createdPrismaArea);
      areaMapper.mapToAggregate.mockResolvedValue(expectedAreaModel);

      // Act
      const result = await prismaAreaRepository.create(areaData);

      // Assert
      expect(prismaClient.area.create).toHaveBeenCalledWith({
        data: {
          name: areaData.name,
          description: areaData.description,
          parent_id: areaData.parent_id,
        },
      });
      expect(areaMapper.mapToAggregate).toHaveBeenCalledWith(expect.any(Area));
      expect(result).toEqual(expectedAreaModel);
    });

    it('should handle errors during creation', async () => {
      const areaData = {
        name: 'Test Area',
        description: 'Test Description',
      };

      prismaClient.area.create.mockRejectedValue(new Error('Database error'));

      await expect(prismaAreaRepository.create(areaData)).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });

  describe('update', () => {
    it('should update an area and return the mapped result', async () => {
      // Arrange
      const areaId = 'area-id';
      const updateData = {
        name: 'Updated Area',
        description: 'Updated Description',
      };

      const updatedPrismaArea = {
        id: areaId,
        name: 'Updated Area',
        description: 'Updated Description',
        parent_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      const expectedAreaModel: AreaModel = {
        id: areaId,
        name: 'Updated Area',
        description: 'Updated Description',
        createdAt: updatedPrismaArea.created_at,
        updatedAt: updatedPrismaArea.updated_at,
      };

      prismaClient.area.update.mockResolvedValue(updatedPrismaArea);
      areaMapper.mapToAggregate.mockResolvedValue(expectedAreaModel);

      // Act
      const result = await prismaAreaRepository.update(areaId, updateData);

      // Assert
      expect(prismaClient.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          name: updateData.name,
          description: updateData.description,
          parent_id: undefined,
          updated_at: expect.any(Date),
        },
      });
      expect(areaMapper.mapToAggregate).toHaveBeenCalledWith(expect.any(Area));
      expect(result).toEqual(expectedAreaModel);
    });

    it('should handle errors during update', async () => {
      const areaId = 'area-id';
      const updateData = {
        name: 'Updated Area',
      };

      prismaClient.area.update.mockRejectedValue(new Error('Database error'));

      await expect(
        prismaAreaRepository.update(areaId, updateData),
      ).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });

  describe('findById', () => {
    it('should find an area by id and return the mapped result', async () => {
      // Arrange
      const areaId = 'area-id';
      const prismaArea = {
        id: areaId,
        name: 'Test Area',
        description: 'Test Description',
        parent_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        parent: null,
        children: [],
      };

      const expectedAreaModel: AreaModel = {
        id: areaId,
        name: 'Test Area',
        description: 'Test Description',
        createdAt: prismaArea.created_at,
        updatedAt: prismaArea.updated_at,
      };

      prismaClient.area.findUnique.mockResolvedValue(prismaArea);
      areaMapper.mapToAggregate.mockResolvedValue(expectedAreaModel);

      const result = await prismaAreaRepository.findById(areaId);

      expect(prismaClient.area.findUnique).toHaveBeenCalledWith({
        where: { id: areaId },
        include: {
          parent: true,
          children: true,
        },
      });
      expect(areaMapper.mapToAggregate).toHaveBeenCalledWith(expect.any(Area));
      expect(result).toEqual(expectedAreaModel);
    });

    it('should return null when area is not found', async () => {
      const areaId = 'non-existent-area-id';
      prismaClient.area.findUnique.mockResolvedValue(null);

      const result = await prismaAreaRepository.findById(areaId);

      expect(prismaClient.area.findUnique).toHaveBeenCalledWith({
        where: { id: areaId },
        include: {
          parent: true,
          children: true,
        },
      });
      expect(result).toBeNull();
    });

    it('should handle errors during findById', async () => {
      const areaId = 'area-id';
      prismaClient.area.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(prismaAreaRepository.findById(areaId)).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should find all areas and return the mapped results', async () => {
      // Arrange
      const prismaAreas = [
        {
          id: 'area-id-1',
          name: 'Test Area 1',
          description: 'Test Description 1',
          parent_id: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          id: 'area-id-2',
          name: 'Test Area 2',
          description: 'Test Description 2',
          parent_id: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ];

      const expectedAreaModels: AreaModel[] = [
        {
          id: 'area-id-1',
          name: 'Test Area 1',
          description: 'Test Description 1',
          createdAt: prismaAreas[0].created_at,
          updatedAt: prismaAreas[0].updated_at,
        },
        {
          id: 'area-id-2',
          name: 'Test Area 2',
          description: 'Test Description 2',
          createdAt: prismaAreas[1].created_at,
          updatedAt: prismaAreas[1].updated_at,
        },
      ];

      prismaClient.area.findMany.mockResolvedValue(prismaAreas);
      areaMapper.mapCollection.mockResolvedValue(expectedAreaModels);

      const result = await prismaAreaRepository.findAll();

      expect(prismaClient.area.findMany).toHaveBeenCalledWith({
        where: {
          deleted_at: null,
        },
      });
      expect(areaMapper.mapCollection).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Area), expect.any(Area)]),
      );
      expect(result).toEqual(expectedAreaModels);
    });

    it('should handle errors during findAll', async () => {
      prismaClient.area.findMany.mockRejectedValue(new Error('Database error'));

      await expect(prismaAreaRepository.findAll()).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });

  describe('delete', () => {
    it('should soft delete an area by updating its deleted_at field', async () => {
      const areaId = 'area-id';
      prismaClient.area.update.mockResolvedValue({});

      await prismaAreaRepository.delete(areaId);

      expect(prismaClient.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          deleted_at: expect.any(Date),
        },
      });
    });

    it('should handle errors during delete', async () => {
      const areaId = 'area-id';
      prismaClient.area.update.mockRejectedValue(new Error('Database error'));

      await expect(prismaAreaRepository.delete(areaId)).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });
});

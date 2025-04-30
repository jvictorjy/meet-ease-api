import { AreaAggregateMapper } from '@app/areas/domain/mappers/area-aggregate.mapper';
import { Area } from '@app/areas/domain/entities/area.entity';

describe('AreaAggregateMapper', () => {
  let mapper: AreaAggregateMapper;

  beforeEach(() => {
    mapper = new AreaAggregateMapper();
  });

  describe('mapToAggregate', () => {
    it('should map an Area entity to an AreaModel', async () => {
      // Arrange
      const id = 'area-id';
      const name = 'Test Area';
      const description = 'Test Description';
      const parent_id = 'parent-id';
      const created_at = new Date();
      const updated_at = new Date();
      const deleted_at = null;

      const areaEntity = new Area(
        id,
        name,
        description,
        parent_id,
        created_at,
        updated_at,
        deleted_at,
      );

      // Act
      const result = await mapper.mapToAggregate(areaEntity);

      // Assert
      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe(id);
      expect(result.name).toBe(name);
      expect(result.description).toBe(description);
      expect(result.parent_id).toBe(parent_id);
    });

    it('should handle null description and parent_id', async () => {
      // Arrange
      const id = 'area-id';
      const name = 'Test Area';
      const description = null;
      const parent_id = null;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted_at = null;

      const areaEntity = new Area(
        id,
        name,
        description,
        parent_id,
        created_at,
        updated_at,
        deleted_at,
      );

      // Act
      const result = await mapper.mapToAggregate(areaEntity);

      // Assert
      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe(id);
      expect(result.name).toBe(name);
      expect(result.description).toBe(description);
      expect(result.parent_id).toBe(parent_id);
    });

    it('should set default values for createdAt and updatedAt if not provided', async () => {
      // Arrange
      const areaEntity = {
        id: 'area-id',
        name: 'Test Area',
        description: 'Test Description',
        parent_id: 'parent-id',
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: null,
      } as unknown as Area;

      // Act
      const result = await mapper.mapToAggregate(areaEntity);

      // Assert
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('mapCollection', () => {
    it('should map an array of Area entities to an array of AreaModels', async () => {
      // Arrange
      const area1 = new Area(
        'area-1',
        'Area 1',
        'Description 1',
        null,
        new Date(),
        new Date(),
        null,
      );

      const area2 = new Area(
        'area-2',
        'Area 2',
        'Description 2',
        'area-1',
        new Date(),
        new Date(),
        null,
      );

      const areas = [area1, area2];

      // Act
      const result = await mapper.mapCollection(areas);

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('area-1');
      expect(result[0].name).toBe('Area 1');
      expect(result[1].id).toBe('area-2');
      expect(result[1].name).toBe('Area 2');
      expect(result[1].parent_id).toBe('area-1');
    });

    it('should return an empty array when given an empty array', async () => {
      // Arrange
      const areas: Area[] = [];

      // Act
      const result = await mapper.mapCollection(areas);

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});

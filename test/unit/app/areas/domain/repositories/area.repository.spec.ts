import { AreaModel } from '@app/areas/domain/models/area.model';
import {
  AreaRepository,
  AreaUpdatePayload,
} from '@app/areas/domain/repositories/area.repository';

class MockAreaRepository implements AreaRepository {
  private areas: AreaModel[] = [];

  async create(
    area: Omit<
      AreaModel,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'parent' | 'children'
    >,
  ): Promise<AreaModel> {
    const newArea = new AreaModel();
    newArea.id = `area-${this.areas.length + 1}`;
    newArea.name = area.name;
    newArea.description = area.description;
    newArea.parent_id = area.parent_id;
    newArea.createdAt = new Date();
    newArea.updatedAt = new Date();
    newArea.deletedAt = null;

    this.areas.push(newArea);
    return newArea;
  }

  async update(id: string, area: AreaUpdatePayload): Promise<AreaModel> {
    const existingArea = this.areas.find((a) => a.id === id);
    if (!existingArea) {
      throw new Error(`Area with id ${id} not found`);
    }

    if (area.name !== undefined) {
      existingArea.name = area.name;
    }
    if (area.description !== undefined) {
      existingArea.description = area.description;
    }
    if (area.parent_id !== undefined) {
      existingArea.parent_id = area.parent_id;
    }
    existingArea.updatedAt = new Date();

    return existingArea;
  }

  async findById(id: string): Promise<AreaModel | null> {
    const area = this.areas.find((a) => a.id === id);
    return area || null;
  }

  async findAll(): Promise<AreaModel[]> {
    return [...this.areas];
  }

  async delete(id: string): Promise<void> {
    const index = this.areas.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Area with id ${id} not found`);
    }
    this.areas.splice(index, 1);
  }
}

describe('AreaRepository', () => {
  let repository: AreaRepository;

  beforeEach(() => {
    repository = new MockAreaRepository();
  });

  describe('create', () => {
    it('should create a new area', async () => {
      // Arrange
      const areaData = {
        name: 'Test Area',
        description: 'Test Description',
        parent_id: 'parent-id',
      };

      // Act
      const result = await repository.create(areaData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(areaData.name);
      expect(result.description).toBe(areaData.description);
      expect(result.parent_id).toBe(areaData.parent_id);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.deletedAt).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing area', async () => {
      // Arrange
      const area = await repository.create({
        name: 'Test Area',
        description: 'Test Description',
        parent_id: 'parent-id',
      });

      const updateData: AreaUpdatePayload = {
        name: 'Updated Area',
        description: 'Updated Description',
      };

      // Act
      const result = await repository.update(area.id, updateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(area.id);
      expect(result.name).toBe(updateData.name);
      expect(result.description).toBe(updateData.description);
      expect(result.parent_id).toBe(area.parent_id); // Unchanged
    });

    it('should throw an error when updating a non-existent area', async () => {
      const updateData: AreaUpdatePayload = {
        name: 'Updated Area',
      };

      await expect(
        repository.update('non-existent-id', updateData),
      ).rejects.toThrow('Area with id non-existent-id not found');
    });
  });

  describe('findById', () => {
    it('should find an area by id', async () => {
      const area = await repository.create({
        name: 'Test Area',
        description: 'Test Description',
        parent_id: 'parent-id',
      });

      const result = await repository.findById(area.id);

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.id).toBe(area.id);
    });

    it('should return null when area is not found', async () => {
      // Act
      const result = await repository.findById('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all areas', async () => {
      // Arrange
      await repository.create({
        name: 'Area 1',
        description: 'Description 1',
        parent_id: undefined,
      });
      await repository.create({
        name: 'Area 2',
        description: 'Description 2',
        parent_id: undefined,
      });

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Area 1');
      expect(result[1].name).toBe('Area 2');
    });

    it('should return an empty array when no areas exist', async () => {
      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('delete', () => {
    it('should delete an area', async () => {
      const area = await repository.create({
        name: 'Test Area',
        description: 'Test Description',
        parent_id: 'parent-id',
      });

      await repository.delete(area.id);
      const result = await repository.findById(area.id);

      expect(result).toBeNull();
    });

    it('should throw an error when deleting a non-existent area', async () => {
      await expect(repository.delete('non-existent-id')).rejects.toThrow(
        'Area with id non-existent-id not found',
      );
    });
  });
});

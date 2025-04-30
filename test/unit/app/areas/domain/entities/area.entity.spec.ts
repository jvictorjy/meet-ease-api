import { Area } from '@app/areas/domain/entities/area.entity';

describe('Area Entity', () => {
  it('should create a valid area', () => {
    const id = 'area-id';
    const name = 'Test Area';
    const description = 'Test Description';
    const parent_id = 'parent-id';
    const created_at = new Date();
    const updated_at = new Date();
    const deleted_at = null;

    const area = new Area(
      id,
      name,
      description,
      parent_id,
      created_at,
      updated_at,
      deleted_at,
    );

    expect(area.id).toBe(id);
    expect(area.name).toBe(name);
    expect(area.description).toBe(description);
    expect(area.parent_id).toBe(parent_id);
    expect(area.createdAt).toBe(created_at);
    expect(area.updatedAt).toBe(updated_at);
    expect(area.deletedAt).toBe(deleted_at);
  });

  it('should create a valid area with null description and parent_id', () => {
    const id = 'area-id';
    const name = 'Test Area';
    const description = null;
    const parent_id = null;
    const created_at = new Date();
    const updated_at = new Date();
    const deleted_at = null;

    const area = new Area(
      id,
      name,
      description,
      parent_id,
      created_at,
      updated_at,
      deleted_at,
    );

    expect(area.id).toBe(id);
    expect(area.name).toBe(name);
    expect(area.description).toBe(description);
    expect(area.parent_id).toBe(parent_id);
    expect(area.createdAt).toBe(created_at);
    expect(area.updatedAt).toBe(updated_at);
    expect(area.deletedAt).toBe(deleted_at);
  });

  it('should throw an error when id is not provided', () => {
    const id = '';
    const name = 'Test Area';
    const description = 'Test Description';
    const parent_id = 'parent-id';
    const created_at = new Date();
    const updated_at = new Date();
    const deleted_at = null;

    expect(() => {
      new Area(
        id,
        name,
        description,
        parent_id,
        created_at,
        updated_at,
        deleted_at,
      );
    }).toThrow('Area id is required');
  });

  it('should throw an error when name is not provided', () => {
    const id = 'area-id';
    const name = '';
    const description = 'Test Description';
    const parent_id = 'parent-id';
    const created_at = new Date();
    const updated_at = new Date();
    const deleted_at = null;

    expect(() => {
      new Area(
        id,
        name,
        description,
        parent_id,
        created_at,
        updated_at,
        deleted_at,
      );
    }).toThrow('Area name is required');
  });

  it('should create a valid area with deleted_at', () => {
    const id = 'area-id';
    const name = 'Test Area';
    const description = 'Test Description';
    const parent_id = 'parent-id';
    const created_at = new Date();
    const updated_at = new Date();
    const deleted_at = new Date();

    const area = new Area(
      id,
      name,
      description,
      parent_id,
      created_at,
      updated_at,
      deleted_at,
    );

    expect(area.id).toBe(id);
    expect(area.name).toBe(name);
    expect(area.description).toBe(description);
    expect(area.parent_id).toBe(parent_id);
    expect(area.createdAt).toBe(created_at);
    expect(area.updatedAt).toBe(updated_at);
    expect(area.deletedAt).toBe(deleted_at);
  });
});

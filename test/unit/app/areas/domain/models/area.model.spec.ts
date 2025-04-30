import { AreaModel } from '@app/areas/domain/models/area.model';

describe('AreaModel', () => {
  it('should create an instance with all properties', () => {
    // Arrange
    const id = 'area-id';
    const name = 'Test Area';
    const description = 'Test Description';
    const parent_id = 'parent-id';
    const createdAt = new Date();
    const updatedAt = new Date();

    // Act
    const areaModel = new AreaModel();
    areaModel.id = id;
    areaModel.name = name;
    areaModel.description = description;
    areaModel.parent_id = parent_id;
    areaModel.createdAt = createdAt;
    areaModel.updatedAt = updatedAt;

    // Assert
    expect(areaModel).toBeDefined();
    expect(areaModel.id).toBe(id);
    expect(areaModel.name).toBe(name);
    expect(areaModel.description).toBe(description);
    expect(areaModel.parent_id).toBe(parent_id);
    expect(areaModel.createdAt).toBe(createdAt);
    expect(areaModel.updatedAt).toBe(updatedAt);
  });

  it('should create an instance with parent and children properties', () => {
    // Arrange
    const parentModel = new AreaModel();
    parentModel.id = 'parent-id';
    parentModel.name = 'Parent Area';

    const childModel = new AreaModel();
    childModel.id = 'child-id';
    childModel.name = 'Child Area';

    // Act
    const areaModel = new AreaModel();
    areaModel.id = 'area-id';
    areaModel.name = 'Test Area';
    areaModel.parent = parentModel;
    areaModel.children = [childModel];

    // Assert
    expect(areaModel).toBeDefined();
    expect(areaModel.parent).toBeDefined();
    expect(areaModel.parent.id).toBe('parent-id');
    expect(areaModel.parent.name).toBe('Parent Area');
    expect(areaModel.children).toBeDefined();
    expect(areaModel.children.length).toBe(1);
    expect(areaModel.children[0].id).toBe('child-id');
    expect(areaModel.children[0].name).toBe('Child Area');
  });

  it('should create an instance with optional properties as undefined', () => {
    // Arrange & Act
    const areaModel = new AreaModel();
    areaModel.id = 'area-id';
    areaModel.name = 'Test Area';
    areaModel.createdAt = new Date();
    areaModel.updatedAt = new Date();

    // Assert
    expect(areaModel).toBeDefined();
    expect(areaModel.id).toBe('area-id');
    expect(areaModel.name).toBe('Test Area');
    expect(areaModel.description).toBeUndefined();
    expect(areaModel.parent_id).toBeUndefined();
    expect(areaModel.parent).toBeUndefined();
    expect(areaModel.children).toBeUndefined();
    expect(areaModel.deletedAt).toBeUndefined();
  });
});

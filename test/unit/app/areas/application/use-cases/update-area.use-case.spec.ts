import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { UpdateAreaUseCase } from '@app/areas/application/use-cases/update-area.use-case';
import {
  AreaRepository,
  AreaUpdatePayload,
} from '@app/areas/domain/repositories/area.repository';
import { AreaModel } from '@app/areas/domain/models/area.model';

describe('UpdateAreaUseCase', () => {
  let updateAreaUseCase: UpdateAreaUseCase;
  let areaRepository: jest.Mocked<AreaRepository>;

  beforeEach(() => {
    areaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<AreaRepository>;

    updateAreaUseCase = new UpdateAreaUseCase(areaRepository);
  });

  it('should update an area when it exists', async () => {
    const areaId = 'area-id';
    const updateData: AreaUpdatePayload = {
      name: 'Updated Area',
      description: 'Updated Description',
    };

    const existingArea: AreaModel = {
      id: areaId,
      name: 'Test Area',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedArea: AreaModel = {
      ...existingArea,
      name: updateData.name ?? existingArea.name,
      description: updateData.description,
      updatedAt: new Date(),
    };

    areaRepository.findById.mockResolvedValue(existingArea);
    areaRepository.update.mockResolvedValue(updatedArea);

    const result = await updateAreaUseCase.execute(areaId, updateData);

    expect(result).toEqual(updatedArea);
    expect(areaRepository.findById).toHaveBeenCalledWith(areaId);
    expect(areaRepository.update).toHaveBeenCalledWith(areaId, updateData);
  });

  it('should update an area with parent_id when parent exists', async () => {
    const areaId = 'area-id';
    const parentId = 'parent-id';
    const updateData: AreaUpdatePayload = {
      name: 'Updated Area',
      description: 'Updated Description',
      parent_id: parentId,
    };

    const existingArea: AreaModel = {
      id: areaId,
      name: 'Test Area',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const parentArea: AreaModel = {
      id: parentId,
      name: 'Parent Area',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedArea: AreaModel = {
      ...existingArea,
      name: updateData.name ?? existingArea.name,
      description: updateData.description,
      parent_id: parentId,
      updatedAt: new Date(),
    };

    areaRepository.findById.mockImplementation(async (id) => {
      if (id === areaId) return existingArea;
      if (id === parentId) return parentArea;
      return null;
    });
    areaRepository.update.mockResolvedValue(updatedArea);

    const result = await updateAreaUseCase.execute(areaId, updateData);

    expect(result).toEqual(updatedArea);
    expect(areaRepository.findById).toHaveBeenCalledWith(areaId);
    expect(areaRepository.findById).toHaveBeenCalledWith(parentId);
    expect(areaRepository.update).toHaveBeenCalledWith(areaId, updateData);
  });

  it('should throw an exception when area does not exist', async () => {
    const areaId = 'non-existent-area-id';
    const updateData: AreaUpdatePayload = {
      name: 'Updated Area',
    };

    areaRepository.findById.mockResolvedValue(null);

    await expect(updateAreaUseCase.execute(areaId, updateData)).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Area not found',
      }),
    );

    expect(areaRepository.findById).toHaveBeenCalledWith(areaId);
    expect(areaRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an exception when parent_id is the same as area id', async () => {
    const areaId = 'area-id';
    const updateData: AreaUpdatePayload = {
      name: 'Updated Area',
      parent_id: areaId, // Same as area id
    };

    const existingArea: AreaModel = {
      id: areaId,
      name: 'Test Area',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    areaRepository.findById.mockResolvedValue(existingArea);

    await expect(updateAreaUseCase.execute(areaId, updateData)).rejects.toThrow(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Area cannot be its own parent',
      }),
    );

    expect(areaRepository.findById).toHaveBeenCalledWith(areaId);
    expect(areaRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an exception when parent area does not exist', async () => {
    const areaId = 'area-id';
    const parentId = 'non-existent-parent-id';
    const updateData: AreaUpdatePayload = {
      name: 'Updated Area',
      parent_id: parentId,
    };

    const existingArea: AreaModel = {
      id: areaId,
      name: 'Test Area',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    areaRepository.findById.mockImplementation(async (id) => {
      if (id === areaId) return existingArea;
      return null; // Parent not found
    });

    await expect(updateAreaUseCase.execute(areaId, updateData)).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Parent area not found',
      }),
    );

    expect(areaRepository.findById).toHaveBeenCalledWith(areaId);
    expect(areaRepository.findById).toHaveBeenCalledWith(parentId);
    expect(areaRepository.update).not.toHaveBeenCalled();
  });

  it('should handle domain exceptions', async () => {
    const areaId = 'area-id';
    const updateData: AreaUpdatePayload = {
      name: 'Updated Area',
    };

    const existingArea: AreaModel = {
      id: areaId,
      name: 'Test Area',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const domainException = Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Domain error',
    });

    areaRepository.findById.mockResolvedValue(existingArea);
    areaRepository.update.mockRejectedValue(domainException);

    await expect(updateAreaUseCase.execute(areaId, updateData)).rejects.toThrow(
      domainException,
    );
  });

  it('should handle unexpected errors', async () => {
    const areaId = 'area-id';
    const updateData: AreaUpdatePayload = {
      name: 'Updated Area',
    };

    const existingArea: AreaModel = {
      id: areaId,
      name: 'Test Area',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    areaRepository.findById.mockResolvedValue(existingArea);
    areaRepository.update.mockRejectedValue(new Error('Database error'));

    await expect(
      updateAreaUseCase.execute(areaId, updateData),
    ).rejects.toThrowError();
  });
});

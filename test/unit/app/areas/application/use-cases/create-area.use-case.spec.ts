import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { CreateAreaUseCase } from '@app/areas/application/use-cases/create-area.use-case';
import { AreaRepository } from '@app/areas/domain/repositories/area.repository';
import { CreateAreaRequestDto } from '@app/areas/interfaces/http/dtos/create-area.dto';
import { AreaModel } from '@app/areas/domain/models/area.model';

describe('CreateAreaUseCase', () => {
  let createAreaUseCase: CreateAreaUseCase;
  let areaRepository: jest.Mocked<AreaRepository>;

  beforeEach(() => {
    areaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<AreaRepository>;

    createAreaUseCase = new CreateAreaUseCase(areaRepository);
  });

  it('should create an area without parent_id', async () => {
    const data: CreateAreaRequestDto = {
      name: 'Test Area',
      description: 'Test Description',
    };

    const createdArea: AreaModel = {
      id: expect.any(String),
      name: 'Test Area',
      description: 'Test Description',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    areaRepository.create.mockResolvedValue(createdArea);

    await createAreaUseCase.execute(data);

    expect(areaRepository.create).toHaveBeenCalledWith({
      name: data.name,
      description: data.description,
    });
  });

  it('should create an area with parent_id when parent exists', async () => {
    const parentId = 'parent-id';
    const data: CreateAreaRequestDto = {
      name: 'Test Area',
      description: 'Test Description',
      parent_id: parentId,
    };

    const parentArea: AreaModel = {
      id: parentId,
      name: 'Parent Area',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdArea: AreaModel = {
      id: expect.any(String),
      name: 'Test Area',
      description: 'Test Description',
      parent_id: parentId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    areaRepository.findById.mockResolvedValue(parentArea);
    areaRepository.create.mockResolvedValue(createdArea);

    await createAreaUseCase.execute(data);

    expect(areaRepository.findById).toHaveBeenCalledWith(parentId);
    expect(areaRepository.create).toHaveBeenCalledWith({
      name: data.name,
      description: data.description,
      parent_id: parentId,
    });
  });

  it('should throw an exception when parent_id is provided but parent does not exist', async () => {
    const parentId = 'non-existent-parent-id';
    const data: CreateAreaRequestDto = {
      name: 'Test Area',
      description: 'Test Description',
      parent_id: parentId,
    };

    areaRepository.findById.mockResolvedValue(null);

    await expect(createAreaUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Parent area not found',
      }),
    );

    expect(areaRepository.findById).toHaveBeenCalledWith(parentId);
    expect(areaRepository.create).not.toHaveBeenCalled();
  });

  it('should handle domain exceptions', async () => {
    const data: CreateAreaRequestDto = {
      name: 'Test Area',
      description: 'Test Description',
    };

    const domainException = Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Domain error',
    });

    areaRepository.create.mockRejectedValue(domainException);

    await expect(createAreaUseCase.execute(data)).rejects.toThrow(
      domainException,
    );
  });

  it('should handle unexpected errors', async () => {
    const data: CreateAreaRequestDto = {
      name: 'Test Area',
      description: 'Test Description',
    };

    areaRepository.create.mockRejectedValue(new Error('Database error'));

    await expect(createAreaUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
  });
});

import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { DeleteAreaUseCase } from '@app/areas/application/use-cases/delete-area.use-case';
import { AreaRepository } from '@app/areas/domain/repositories/area.repository';
import { AreaModel } from '@app/areas/domain/models/area.model';

describe('DeleteAreaUseCase', () => {
  let deleteAreaUseCase: DeleteAreaUseCase;
  let areaRepository: jest.Mocked<AreaRepository>;

  beforeEach(() => {
    areaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<AreaRepository>;

    deleteAreaUseCase = new DeleteAreaUseCase(areaRepository);
  });

  it('should delete an area when it exists', async () => {
    const areaId = 'area-id';
    const area: AreaModel = {
      id: areaId,
      name: 'Test Area',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    areaRepository.findById.mockResolvedValue(area);
    areaRepository.delete.mockResolvedValue();

    await deleteAreaUseCase.execute(areaId);

    expect(areaRepository.findById).toHaveBeenCalledWith(areaId);
    expect(areaRepository.delete).toHaveBeenCalledWith(areaId);
  });

  it('should throw an exception when area does not exist', async () => {
    const areaId = 'non-existent-area-id';

    areaRepository.findById.mockResolvedValue(null);

    await expect(deleteAreaUseCase.execute(areaId)).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Area not found',
      }),
    );

    expect(areaRepository.findById).toHaveBeenCalledWith(areaId);
    expect(areaRepository.delete).not.toHaveBeenCalled();
  });

  it('should handle domain exceptions', async () => {
    const areaId = 'area-id';
    const area: AreaModel = {
      id: areaId,
      name: 'Test Area',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const domainException = Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Domain error',
    });

    areaRepository.findById.mockResolvedValue(area);
    areaRepository.delete.mockRejectedValue(domainException);

    await expect(deleteAreaUseCase.execute(areaId)).rejects.toThrow(domainException);
  });

  it('should handle unexpected errors', async () => {
    const areaId = 'area-id';
    const area: AreaModel = {
      id: areaId,
      name: 'Test Area',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    areaRepository.findById.mockResolvedValue(area);
    areaRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(deleteAreaUseCase.execute(areaId)).rejects.toThrow(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
  });
});
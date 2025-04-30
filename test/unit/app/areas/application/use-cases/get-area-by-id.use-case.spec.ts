import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { GetAreaByIdUseCase } from '@app/areas/application/use-cases/get-area-by-id.use-case';
import { AreaRepository } from '@app/areas/domain/repositories/area.repository';
import { AreaModel } from '@app/areas/domain/models/area.model';

describe('GetAreaByIdUseCase', () => {
  let getAreaByIdUseCase: GetAreaByIdUseCase;
  let areaRepository: jest.Mocked<AreaRepository>;

  beforeEach(() => {
    areaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<AreaRepository>;

    getAreaByIdUseCase = new GetAreaByIdUseCase(areaRepository);
  });

  it('should return an area when it exists', async () => {
    const areaId = 'area-id';
    const area: AreaModel = {
      id: areaId,
      name: 'Test Area',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    areaRepository.findById.mockResolvedValue(area);

    const result = await getAreaByIdUseCase.execute(areaId);

    expect(result).toEqual(area);
    expect(areaRepository.findById).toHaveBeenCalledWith(areaId);
  });

  it('should throw an exception when area does not exist', async () => {
    const areaId = 'non-existent-area-id';

    areaRepository.findById.mockResolvedValue(null);

    await expect(getAreaByIdUseCase.execute(areaId)).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Area not found',
      }),
    );

    expect(areaRepository.findById).toHaveBeenCalledWith(areaId);
  });

  it('should handle domain exceptions', async () => {
    const areaId = 'area-id';
    const domainException = Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Domain error',
    });

    areaRepository.findById.mockRejectedValue(domainException);

    await expect(getAreaByIdUseCase.execute(areaId)).rejects.toThrow(
      domainException,
    );
  });

  it('should handle unexpected errors', async () => {
    const areaId = 'area-id';

    areaRepository.findById.mockRejectedValue(new Error('Database error'));

    await expect(getAreaByIdUseCase.execute(areaId)).rejects.toThrow(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
  });
});

import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { GetAllAreasUseCase } from '@app/areas/application/use-cases/get-all-areas.use-case';
import { AreaRepository } from '@app/areas/domain/repositories/area.repository';
import { AreaModel } from '@app/areas/domain/models/area.model';

describe('GetAllAreasUseCase', () => {
  let getAllAreasUseCase: GetAllAreasUseCase;
  let areaRepository: jest.Mocked<AreaRepository>;

  beforeEach(() => {
    areaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<AreaRepository>;

    getAllAreasUseCase = new GetAllAreasUseCase(areaRepository);
  });

  it('should return all areas', async () => {
    const areas: AreaModel[] = [
      {
        id: 'area-id-1',
        name: 'Test Area 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'area-id-2',
        name: 'Test Area 2',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    areaRepository.findAll.mockResolvedValue(areas);

    const result = await getAllAreasUseCase.execute();

    expect(result).toEqual(areas);
    expect(areaRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty array when no areas exist', async () => {
    areaRepository.findAll.mockResolvedValue([]);

    const result = await getAllAreasUseCase.execute();

    expect(result).toEqual([]);
    expect(areaRepository.findAll).toHaveBeenCalled();
  });

  it('should handle domain exceptions', async () => {
    const domainException = Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Domain error',
    });

    areaRepository.findAll.mockRejectedValue(domainException);

    await expect(getAllAreasUseCase.execute()).rejects.toThrow(domainException);
  });

  it('should handle unexpected errors', async () => {
    areaRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(getAllAreasUseCase.execute()).rejects.toThrowError();
  });
});

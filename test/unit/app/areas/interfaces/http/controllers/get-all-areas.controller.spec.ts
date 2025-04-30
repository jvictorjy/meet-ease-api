import { Test, TestingModule } from '@nestjs/testing';
import { GetAllAreasController } from '@app/areas/interfaces/http/controllers/get-all-areas.controller';
import { GetAllAreasUseCase } from '@app/areas/application/use-cases/get-all-areas.use-case';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('GetAllAreasController', () => {
  let controller: GetAllAreasController;
  let getAllAreasUseCase: GetAllAreasUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllAreasController],
      providers: [
        {
          provide: GetAllAreasUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetAllAreasController>(GetAllAreasController);
    getAllAreasUseCase = module.get<GetAllAreasUseCase>(GetAllAreasUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all areas when use case executes successfully', async () => {
    const expectedAreas = [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Area 1',
        description: 'This is area 1',
        parent_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Area 2',
        description: 'This is area 2',
        parent_id: '123e4567-e89b-12d3-a456-426614174001',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    jest.spyOn(getAllAreasUseCase, 'execute').mockResolvedValue(expectedAreas);

    const result = await controller.handle();

    expect(result).toEqual(expectedAreas);
    expect(getAllAreasUseCase.execute).toHaveBeenCalled();
  });

  it('should return an empty array when there are no areas', async () => {
    jest.spyOn(getAllAreasUseCase, 'execute').mockResolvedValue([]);

    const result = await controller.handle();

    expect(result).toEqual([]);
    expect(getAllAreasUseCase.execute).toHaveBeenCalled();
  });

  it('should throw an error when use case throws an exception', async () => {
    jest.spyOn(getAllAreasUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'Error retrieving areas',
      }),
    );

    await expect(controller.handle()).rejects.toThrow('Error retrieving areas');
  });
});

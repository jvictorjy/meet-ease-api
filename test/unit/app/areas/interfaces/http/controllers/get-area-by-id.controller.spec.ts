import { Test, TestingModule } from '@nestjs/testing';
import { GetAreaByIdController } from '@app/areas/interfaces/http/controllers/get-area-by-id.controller';
import { GetAreaByIdUseCase } from '@app/areas/application/use-cases/get-area-by-id.use-case';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('GetAreaByIdController', () => {
  let controller: GetAreaByIdController;
  let getAreaByIdUseCase: GetAreaByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAreaByIdController],
      providers: [
        {
          provide: GetAreaByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetAreaByIdController>(GetAreaByIdController);
    getAreaByIdUseCase = module.get<GetAreaByIdUseCase>(GetAreaByIdUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an area when use case executes successfully', async () => {
    const areaId = '123e4567-e89b-12d3-a456-426614174000';
    const expectedArea = {
      id: areaId,
      name: 'Test Area',
      description: 'This is a test area',
      parent_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(getAreaByIdUseCase, 'execute').mockResolvedValue(expectedArea);

    const result = await controller.handle(areaId);

    expect(result).toEqual(expectedArea);
    expect(getAreaByIdUseCase.execute).toHaveBeenCalledWith(areaId);
  });

  it('should throw an error when use case throws a not found exception', async () => {
    const areaId = '123e4567-e89b-12d3-a456-426614174000';

    jest.spyOn(getAreaByIdUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Area not found',
      }),
    );

    await expect(controller.handle(areaId)).rejects.toThrow('Area not found');
  });

  it('should throw an error when use case throws a bad request exception', async () => {
    const invalidId = 'invalid-uuid';

    jest.spyOn(getAreaByIdUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Invalid area ID format',
      }),
    );

    await expect(controller.handle(invalidId)).rejects.toThrow(
      'Invalid area ID format',
    );
  });
});

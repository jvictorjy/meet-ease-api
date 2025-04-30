import { Test, TestingModule } from '@nestjs/testing';
import { DeleteAreaController } from '@app/areas/interfaces/http/controllers/delete-area.controller';
import { DeleteAreaUseCase } from '@app/areas/application/use-cases/delete-area.use-case';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('DeleteAreaController', () => {
  let controller: DeleteAreaController;
  let deleteAreaUseCase: DeleteAreaUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteAreaController],
      providers: [
        {
          provide: DeleteAreaUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeleteAreaController>(DeleteAreaController);
    deleteAreaUseCase = module.get<DeleteAreaUseCase>(DeleteAreaUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delete an area when use case executes successfully', async () => {
    const areaId = '123e4567-e89b-12d3-a456-426614174000';

    jest.spyOn(deleteAreaUseCase, 'execute').mockResolvedValue(undefined);

    await controller.handle(areaId);

    expect(deleteAreaUseCase.execute).toHaveBeenCalledWith(areaId);
  });

  it('should throw an error when use case throws a not found exception', async () => {
    const areaId = '123e4567-e89b-12d3-a456-426614174000';

    jest.spyOn(deleteAreaUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Area not found',
      }),
    );

    await expect(controller.handle(areaId)).rejects.toThrow('Area not found');
  });

  it('should throw an error when use case throws a conflict exception', async () => {
    const areaId = '123e4567-e89b-12d3-a456-426614174000';

    jest.spyOn(deleteAreaUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.CONFLICT.code,
        overrideMessage: 'Cannot delete area with child areas',
      }),
    );

    await expect(controller.handle(areaId)).rejects.toThrow(
      'Cannot delete area with child areas',
    );
  });
});

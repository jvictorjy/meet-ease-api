import { Test, TestingModule } from '@nestjs/testing';
import { CreateAreaController } from '@app/areas/interfaces/http/controllers/create-area.controller';
import { CreateAreaUseCase } from '@app/areas/application/use-cases/create-area.use-case';
import { CreateAreaRequestDto } from '@app/areas/interfaces/http/dtos/create-area.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { CreateAreaSchemaValidator } from '@app/areas/application/validators/create-area-schema.validator';

describe('CreateAreaController', () => {
  let controller: CreateAreaController;
  let createAreaUseCase: CreateAreaUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAreaController],
      providers: [
        {
          provide: CreateAreaUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateAreaController>(CreateAreaController);
    createAreaUseCase = module.get<CreateAreaUseCase>(CreateAreaUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an area when use case executes successfully', async () => {
    const body: CreateAreaRequestDto = {
      name: 'Test Area',
      description: 'This is a test area',
      parent_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const expectedResult = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Test Area',
      description: 'This is a test area',
      parent_id: '123e4567-e89b-12d3-a456-426614174000',
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(createAreaUseCase, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.handle(body);

    expect(result).toEqual(expectedResult);
    expect(createAreaUseCase.execute).toHaveBeenCalledWith(body);
  });

  it('should throw an error when use case throws a domain exception', async () => {
    const body: CreateAreaRequestDto = {
      name: 'Test Area',
      description: 'This is a test area',
      parent_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    jest.spyOn(createAreaUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Parent area not found',
      }),
    );

    await expect(controller.handle(body)).rejects.toThrow(
      'Parent area not found',
    );
  });

  it('should throw an error when validation fails', async () => {
    const invalidData = {
      name: '',
      description: 'This is a test area',
    };

    const validationPipe = new ZodValidationPipe(
      new CreateAreaSchemaValidator(),
    );

    await expect(validationPipe.transform(invalidData)).rejects.toThrow();
  });
});

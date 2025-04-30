import { Test, TestingModule } from '@nestjs/testing';
import { FindAllProfileController } from '@app/profiles/interfaces/http/controllers/find-all-profile.controller';
import { FindAllProfileUseCase } from '@app/profiles/application/use-cases/find-all-profile.use-case';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('FindAllProfileController', () => {
  let controller: FindAllProfileController;
  let findAllProfileUseCase: FindAllProfileUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindAllProfileController],
      providers: [
        {
          provide: FindAllProfileUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FindAllProfileController>(FindAllProfileController);
    findAllProfileUseCase = module.get<FindAllProfileUseCase>(
      FindAllProfileUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all profiles when use case executes successfully', async () => {
    const expectedResult = [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Test Profile 1',
        description: 'This is test profile 1',
        role: RoleName.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Test Profile 2',
        description: 'This is test profile 2',
        role: RoleName.CORE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest
      .spyOn(findAllProfileUseCase, 'execute')
      .mockResolvedValue(expectedResult);

    const result = await controller.handle();

    expect(result).toEqual(expectedResult);
    expect(findAllProfileUseCase.execute).toHaveBeenCalled();
  });

  it('should throw an error when use case throws a domain exception', async () => {
    jest.spyOn(findAllProfileUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'Error retrieving profiles',
      }),
    );

    await expect(controller.handle()).rejects.toThrow(
      'Error retrieving profiles',
    );
  });
});

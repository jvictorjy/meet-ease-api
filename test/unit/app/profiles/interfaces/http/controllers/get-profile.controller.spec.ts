import { Test, TestingModule } from '@nestjs/testing';
import { GetProfileController } from '@app/profiles/interfaces/http/controllers/get-profile.controller';
import { GetProfileUseCase } from '@app/profiles/application/use-cases/get-profile.use-case';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('GetProfileController', () => {
  let controller: GetProfileController;
  let getProfileUseCase: GetProfileUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetProfileController],
      providers: [
        {
          provide: GetProfileUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetProfileController>(GetProfileController);
    getProfileUseCase = module.get<GetProfileUseCase>(GetProfileUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a profile when use case executes successfully', async () => {
    const profileId = '123e4567-e89b-12d3-a456-426614174001';

    const expectedResult = {
      id: profileId,
      name: 'Test Profile',
      description: 'This is a test profile',
      role: RoleName.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(getProfileUseCase, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.handle(profileId);

    expect(result).toEqual(expectedResult);
    expect(getProfileUseCase.execute).toHaveBeenCalledWith(profileId);
  });

  it('should throw an error when use case throws a domain exception', async () => {
    const profileId = '123e4567-e89b-12d3-a456-426614174001';

    jest.spyOn(getProfileUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Profile not found',
      }),
    );

    await expect(controller.handle(profileId)).rejects.toThrow(
      'Profile not found',
    );
  });
});

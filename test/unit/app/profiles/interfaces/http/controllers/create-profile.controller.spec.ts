import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfileUseCase } from '@app/profiles/application/use-cases/create-profiele.use-case';
import { CreateProfileController } from '@app/profiles/interfaces/http/controllers/create-profile.controller';
import { Profile } from '@app/profiles/domain/entities/profile.entity';

describe('CreateProfileController', () => {
  let controller: CreateProfileController;
  let createProfileUseCase: CreateProfileUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateProfileController],
      providers: [
        {
          provide: CreateProfileUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateProfileController>(CreateProfileController);
    createProfileUseCase =
      module.get<CreateProfileUseCase>(CreateProfileUseCase);
  });

  it('creates a profile successfully with valid input', async () => {
    const validInput = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      role: 'admin',
      description: 'This is a valid description',
    };

    const expectedOutput = new Profile(
      '1',
      'admin',
      'This is a valid description',
      new Date(),
      new Date(),
    );

    jest
      .spyOn(createProfileUseCase, 'execute')
      .mockResolvedValue(expectedOutput);

    const result = await controller.handle(validInput);

    expect(result).toEqual(expectedOutput);
    expect(createProfileUseCase.execute).toHaveBeenCalledWith(
      validInput.role,
      validInput.description,
    );
  });

  it('handles null description correctly', async () => {
    const validInput = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      role: 'user',
      description: null,
    };

    const expectedOutput = new Profile(
      '2',
      'user',
      null,
      new Date(),
      new Date(),
    );

    jest
      .spyOn(createProfileUseCase, 'execute')
      .mockResolvedValue(expectedOutput);

    const result = await controller.handle(validInput);

    expect(result).toEqual(expectedOutput);
    expect(createProfileUseCase.execute).toHaveBeenCalledWith(
      validInput.role,
      validInput.description,
    );
  });
});

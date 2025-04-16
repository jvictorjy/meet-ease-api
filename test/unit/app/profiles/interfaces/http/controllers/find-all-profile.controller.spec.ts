import { FindAllProfileUseCase } from '@app/profiles/application/use-cases';
import { NotFoundException } from '@nestjs/common';
import { FindAllProfileController } from '@app/profiles/interfaces/http/controllers';

describe('FindAllProfileController', () => {
  let controller: FindAllProfileController;
  let findAllProfileUseCase: jest.Mocked<FindAllProfileUseCase>;

  beforeEach(() => {
    findAllProfileUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindAllProfileUseCase>;

    controller = new FindAllProfileController(findAllProfileUseCase);
  });

  it('returns HTTP 200 and a list of profiles when profiles exist', async () => {
    const mockProfiles = [
      {
        id: '1',
        role: 'admin',
        description: 'desc1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        role: 'user',
        description: 'desc2',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    findAllProfileUseCase.execute.mockResolvedValue(mockProfiles);

    const result = await controller.handle();

    expect(findAllProfileUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(mockProfiles);
  });

  it('returns HTTP 200 and an empty array when no profiles exist', async () => {
    findAllProfileUseCase.execute.mockResolvedValue([]);

    const result = await controller.handle();

    expect(findAllProfileUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('throws HTTP 404 when profiles are not found', async () => {
    findAllProfileUseCase.execute.mockRejectedValue(
      new NotFoundException('Profiles not found'),
    );

    await expect(controller.handle()).rejects.toThrow(NotFoundException);
    expect(findAllProfileUseCase.execute).toHaveBeenCalled();
  });

  it('throws an error when the use case throws an unexpected error', async () => {
    findAllProfileUseCase.execute.mockRejectedValue(
      new Error('Unexpected error'),
    );

    await expect(controller.handle()).rejects.toThrowError('Unexpected error');
    expect(findAllProfileUseCase.execute).toHaveBeenCalled();
  });
});

import { GetProfileController } from '@app/profiles/interfaces/http/controllers/get-profile.controller';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetProfileUseCase } from '@app/profiles/application/use-cases/get-profile.use-case';
import { GetProfileUseCaseResponseDto } from '@app/profiles/application/dtos/get-profile.dto';

describe('GetProfileController', () => {
  let getProfileController: GetProfileController;
  let getProfileUseCase: jest.Mocked<GetProfileUseCase>;

  beforeEach(() => {
    getProfileUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetProfileUseCase>;

    getProfileController = new GetProfileController(getProfileUseCase);
  });

  it('returns profile data when profile exists', async () => {
    const mockProfile: GetProfileUseCaseResponseDto = {
      id: '123',
      // Using type assertion to add the name property for testing purposes
    } as GetProfileUseCaseResponseDto & { name: string };
    getProfileUseCase.execute.mockResolvedValue(mockProfile);

    const result = await getProfileController.handle('123');

    expect(result).toEqual(mockProfile);
    expect(getProfileUseCase.execute).toHaveBeenCalledWith('123');
  });

  it('throws BadRequestException when id is invalid', async () => {
    getProfileUseCase.execute.mockRejectedValue(
      new BadRequestException('Invalid ID'),
    );

    await expect(getProfileController.handle('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
    expect(getProfileUseCase.execute).toHaveBeenCalledWith('invalid-id');
  });

  it('throws NotFoundException when profile does not exist', async () => {
    getProfileUseCase.execute.mockRejectedValue(
      new NotFoundException('Profile not found'),
    );

    await expect(
      getProfileController.handle('non-existent-id'),
    ).rejects.toThrow(NotFoundException);
    expect(getProfileUseCase.execute).toHaveBeenCalledWith('non-existent-id');
  });

  it('handles unexpected errors gracefully', async () => {
    getProfileUseCase.execute.mockRejectedValue(new Error('Unexpected error'));

    await expect(getProfileController.handle('123')).rejects.toThrow(Error);
    expect(getProfileUseCase.execute).toHaveBeenCalledWith('123');
  });
});

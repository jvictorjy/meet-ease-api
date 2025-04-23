import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetUserByIdController } from '@app/users/interfaces/http/controllers/get-user-by-id.controller';
import { GetUserByIdUseCase } from '@app/users/application/use-cases/get-user-by-id.use-case';
import { GetUserResponseDto } from '@app/users/interfaces/http/dtos/get-user.dto';

describe('GetUserByIdController', () => {
  let controller: GetUserByIdController;
  let mockGetUserByIdUseCase: Partial<GetUserByIdUseCase>;

  beforeEach(async () => {
    mockGetUserByIdUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetUserByIdController],
      providers: [
        {
          provide: GetUserByIdUseCase,
          useValue: mockGetUserByIdUseCase,
        },
      ],
    }).compile();

    controller = module.get<GetUserByIdController>(GetUserByIdController);
  });

  it('should return user data when called with a valid ID', async () => {
    const mockUser: GetUserResponseDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '123-456-7890',
      created_at: new Date('2023-01-01T00:00:00Z'),
      updated_at: new Date('2023-01-02T00:00:00Z'),
    };
    (mockGetUserByIdUseCase.execute as jest.Mock).mockResolvedValue(mockUser);

    const result = await controller.handle(mockUser.id);

    expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException when the user does not exist', async () => {
    const invalidId = 'invalid-id';
    (mockGetUserByIdUseCase.execute as jest.Mock).mockRejectedValue(
      new NotFoundException(),
    );

    await expect(controller.handle(invalidId)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith(invalidId);
  });
});

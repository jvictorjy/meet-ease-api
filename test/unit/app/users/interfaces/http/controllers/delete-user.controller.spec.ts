import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from '@app/users/interfaces/http/controllers/delete-user.controller';
import { DeleteUserUseCase } from '@app/users/application/use-cases/delete-user.use-case';

describe('DeleteUserController', () => {
  let controller: DeleteUserController;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        {
          provide: DeleteUserUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<DeleteUserController>(DeleteUserController);
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  describe('handle', () => {
    it('should call deleteUserUseCase.execute with the correct userId', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue();

      await controller.handle(userId);

      expect(deleteUserUseCase.execute).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if deleteUserUseCase.execute fails', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      jest
        .spyOn(deleteUserUseCase, 'execute')
        .mockRejectedValue(new Error('Test error'));

      await expect(controller.handle(userId)).rejects.toThrow('Test error');
    });

    it('should return no content (204) if user is deleted successfully', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue();

      await expect(controller.handle(userId)).resolves.toBeUndefined();
    });
  });
});

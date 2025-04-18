import { UpdateUserUseCase } from '@app/users/application/use-cases/update-user.use-case';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UpdateUserRequestDto } from '@app/users/interfaces/http/dtos/update-user.dto';
import { User } from '@app/users/domain/entities/user.entity';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
  });

  it('should update and return the updated user', async () => {
    const userId = 'user-123';
    const payload: UpdateUserRequestDto = {
      name: 'Updated Name',
      email: 'updated.email@example.com',
      phone: '123-456-7890',
    };
    const existingUser: User = new User(
      userId,
      'Old Name',
      'old.email@example.com',
      '987-654-3210',
      'hashedpassword',
      'profile-123',
      new Date(),
      new Date(),
    );
    const updatedUser = { ...existingUser, ...payload };

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.update.mockResolvedValue(updatedUser);

    const result = await updateUserUseCase.execute(userId, payload);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.update).toHaveBeenCalledWith(updatedUser);
    expect(result).toEqual({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      profile_id: updatedUser.profile_id,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    });
  });

  it('should throw an exception if the user is not found', async () => {
    const userId = 'non-existent-id';
    const payload: UpdateUserRequestDto = {
      name: 'Updated Name',
    };

    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(updateUserUseCase.execute(userId, payload)).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Error updating user: User not found',
      }),
    );

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw an exception if updating the user fails', async () => {
    const userId = 'user-123';
    const payload: UpdateUserRequestDto = {
      name: 'Updated Name',
    };
    const existingUser: User = new User(
      userId,
      'Old Name',
      'old.email@example.com',
      '987-654-3210',
      'hashedpassword',
      'profile-123',
      new Date(),
      new Date(),
    );

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.update.mockRejectedValue(new Error('Database error'));

    await expect(updateUserUseCase.execute(userId, payload)).rejects.toThrow(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Error updating user: Database error',
      }),
    );

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.update).toHaveBeenCalled();
  });
});

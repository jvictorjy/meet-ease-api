import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { HashGenerator } from '@app/common/application/cryptography';
import { CreateUserRequestDto } from '@app/users/interfaces/http/dtos/create-user.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { User } from '@app/users/domain/entities/user.entity';
import { CreateUserUseCase } from '@app/users/application/use-cases/create-user.use-case';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let profileRepository: jest.Mocked<ProfileRepository>;
  let hashProvider: jest.Mocked<HashGenerator>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      // other methods can be mocked if needed
    } as unknown as jest.Mocked<UserRepository>;

    profileRepository = {
      findById: jest.fn(),
      // other methods can be mocked if needed
    } as unknown as jest.Mocked<ProfileRepository>;

    hashProvider = {
      hash: jest.fn(),
    } as unknown as jest.Mocked<HashGenerator>;

    createUserUseCase = new CreateUserUseCase(
      userRepository,
      profileRepository,
      hashProvider,
    );
  });

  it('throws an exception when email is already in use', async () => {
    const data: CreateUserRequestDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      password: 'password123',
      confirm_password: 'password123',
      profile_id: 'valid-profile',
    };

    jest.spyOn(profileRepository, 'findById').mockResolvedValue({
      id: 'valid-profile',
    });

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValue(
        new User(
          'existing-id',
          'Existing User',
          'john.doe@example.com',
          '0987654321',
          'hashedPassword',
          'valid-profile',
          new Date(),
          new Date(),
        ),
      );

    await expect(createUserUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.CONFLICT.code,
        overrideMessage: 'Error creating user: Email already in use',
      }),
    );
  });

  it('creates a user successfully when all data is valid', async () => {
    const data: CreateUserRequestDto = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '9876543210',
      password: 'securePassword',
      confirm_password: 'securePassword',
      profile_id: 'valid-profile',
    };

    jest
      .spyOn(profileRepository, 'findById')
      .mockResolvedValue({ id: 'valid-profile' });
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(hashProvider, 'hash').mockResolvedValue('securePassword');
    jest.spyOn(userRepository, 'create').mockResolvedValue(undefined);

    const result = await createUserUseCase.execute(data);

    expect(result).toEqual(
      expect.objectContaining({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '9876543210',
        password: 'securePassword',
        profile_id: 'valid-profile',
      }),
    );
  });

  it('throws an exception when profile is not found', async () => {
    const data: CreateUserRequestDto = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '9876543210',
      password: 'securePassword',
      confirm_password: 'securePassword',
      profile_id: 'nonexistent-profile',
    };

    jest.spyOn(profileRepository, 'findById').mockResolvedValue(null);

    await expect(createUserUseCase.execute(data)).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Error creating user: Profile not found',
      }),
    );
  });
});

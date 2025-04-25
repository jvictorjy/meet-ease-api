import { v4 as uuid } from 'uuid';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { User } from '@app/users/domain/entities/user.entity';
import { CreateUserRequestDto } from '@app/users/interfaces/http/dtos/create-user.dto';
import { HashGenerator } from '@app/@common/application/cryptography';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,

    @Inject('HashGenerator')
    private readonly hashProvider: HashGenerator,
  ) {}

  async execute(data: CreateUserRequestDto): Promise<void> {
    try {
      const { name, email, phone, password, profile_id } = data;

      const profile = await this.profileRepository.findById(profile_id);

      if (!profile) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Profile not found`,
        });
      }

      const emailExists = await this.userRepository.findByEmail(email);

      if (emailExists) {
        throw Exception.new({
          code: Code.CONFLICT.code,
          overrideMessage: `Email already in use`,
        });
      }

      const hashedPassword = await this.hashProvider.hash(password);

      const user = new User(
        uuid(),
        name,
        email,
        phone,
        hashedPassword,
        profile_id,
        new Date(),
        new Date(),
      );

      await this.userRepository.create(user);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      });
    }
  }
}

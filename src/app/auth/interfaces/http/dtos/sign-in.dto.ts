import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class SignInDto {
  @ApiProperty({ type: 'string', example: faker.internet.email() })
  email: string;

  @ApiProperty({ type: 'string', example: faker.internet.password() })
  password: string;
}

class UserDto {
  @ApiProperty({ type: 'string', example: faker.person.fullName() })
  name: string;

  @ApiProperty({ type: 'string', example: faker.internet.email() })
  email: string;
}

class ProfileDto {
  @ApiProperty({ type: 'string', example: faker.person.fullName() })
  name: string;

  @ApiProperty({ type: 'string', example: 'ADMIN' })
  role: string;

  @ApiProperty({ type: 'string', example: 'Administrador do sistema' })
  description: string | null;
}

export class SignInResponseDto {
  @ApiProperty({ type: 'string', example: faker.internet.jwt() })
  accessToken: string;

  @ApiProperty({ type: 'string', example: faker.internet.jwt() })
  refreshToken: string;

  @ApiProperty({
    type: UserDto,
    example: { name: faker.person.fullName(), email: faker.internet.email() },
  })
  user: {
    name: string;
    email: string;
  };

  @ApiProperty({
    type: ProfileDto,
    example: {
      name: 'Admin',
      role: 'ADMIN',
      description: 'Administrador do sistema',
    },
  })
  profile: {
    name: string;
    role: string;
    description: string | null;
  };
}

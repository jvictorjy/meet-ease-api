import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class RefreshTokenDto {
  @ApiProperty({ type: 'string', example: faker.internet.jwt() })
  refreshToken: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ type: 'string', example: faker.internet.jwt() })
  accessToken: string;

  @ApiProperty({ type: 'string', example: faker.internet.jwt() })
  refreshToken: string;
}

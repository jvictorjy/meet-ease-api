import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class ChangePasswordRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Current password',
    example: faker.internet.password(),
  })
  current_password: string;

  @ApiProperty({
    type: 'string',
    description: 'New password',
    example: faker.internet.password(),
  })
  password: string;

  @ApiProperty({
    type: 'string',
    description: 'Confirm new password',
    example: faker.internet.password(),
  })
  confirm_password: string;
}

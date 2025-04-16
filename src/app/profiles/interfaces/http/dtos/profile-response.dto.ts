import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { z } from 'zod';

export const CreateProfileSchema = z.object({
  role: z.string().min(1, { message: 'Role is required' }),
  description: z
    .string()
    .max(500, { message: 'Description cannot exceed 500 characters' })
    .nullable(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;

export class CreateProfileDtoSwagger {
  id?: string;

  @ApiProperty({
    type: 'string',
    description: 'Role assigned to the profile',
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    type: 'string',
    description: 'Description of the profile',
    example: faker.lorem.paragraph(),
    nullable: true,
  })
  description?: string;
}

import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

export class RefreshTokenSchemaValidators implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    return z.object({
      refreshToken: z
        .string({
          description: 'Refresh Token',
          invalid_type_error: 'Refresh Token must be a string',
          required_error: 'Refresh Token is required',
        })
        .trim()
        .min(1, { message: 'Refresh Token must be at least 1 character' }),
    });
  }
}

import { CreateValidationSchema } from '@app/common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

export class UpdateProfileSchemaValidation implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    return z.object({
      description: z
        .string({
          description: 'Description',
          invalid_type_error: 'Description must be a string',
        })
        .trim()
        .min(1, { message: 'Description must be at least 1 character' })
        .optional(),
    });
  }
}

import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

export class UpdateProfileSchemaValidator implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    return z.object({
      name: z
        .string({
          description: 'Role',
          invalid_type_error: 'Role must be a string',
          required_error: 'Role is required',
        })
        .trim()
        .min(1, { message: 'Role must be at least 1 character' }),
      role: z
        .string({
          description: 'Role',
          invalid_type_error: 'Role must be a string',
          required_error: 'Role is required',
        })
        .trim()
        .min(1, { message: 'Role must be at least 1 character' }),
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

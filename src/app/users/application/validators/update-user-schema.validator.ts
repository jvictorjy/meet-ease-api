import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

export class UpdateUserSchemaValidator implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    return z
      .object({
        name: z
          .string({
            description: 'Name',
            invalid_type_error: 'Name must be a string',
            required_error: 'Name is required',
          })
          .trim()
          .min(1, { message: 'Name must be at least 1 character' }),
        email: z
          .string({
            description: 'Email',
            invalid_type_error: 'Email must be a string',
            required_error: 'Email is required',
          })
          .email({ message: 'Invalid email address' })
          .trim()
          .min(1, { message: 'Email must be at least 1 character' }),
        phone: z
          .string({
            description: 'Phone',
            invalid_type_error: 'Phone must be a string',
            required_error: 'Phone is required',
          })
          .trim()
          .min(1, { message: 'Phone must be at least 1 character' }),
      })
      .strict();
  }
}

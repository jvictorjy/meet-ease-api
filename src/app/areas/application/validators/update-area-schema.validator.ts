import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

export class UpdateAreaSchemaValidator implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    return z.object({
      name: z
        .string({
          description: 'Name of the area',
          invalid_type_error: 'Name must be a string',
        })
        .trim()
        .min(1, { message: 'Name must be at least 1 character' })
        .optional(),
      description: z
        .string({
          description: 'Description of the area',
          invalid_type_error: 'Description must be a string',
        })
        .trim()
        .optional(),
      parent_id: z
        .string({
          description: 'Parent area ID',
          invalid_type_error: 'Parent ID must be a string',
        })
        .uuid({ message: 'Parent ID must be a valid UUID' })
        .optional(),
    });
  }
}

import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

export class CreateRoomLayoutSchemaValidator implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    return z.object({
      description: z
        .string({
          description: 'Description of the room layout',
          invalid_type_error: 'Description must be a string',
        })
        .trim()
        .optional(),
      imageUrl: z
        .string({
          description: 'URL of the room layout image',
          invalid_type_error: 'Image URL must be a string',
          required_error: 'Image URL is required',
        })
        .trim()
        .url({ message: 'Image URL must be a valid URL' }),
    });
  }
}

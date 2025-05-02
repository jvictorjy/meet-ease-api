import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

export class CreateRoomSchemaValidator implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    return z.object({
      name: z
        .string({
          description: 'Name of the room',
          invalid_type_error: 'Name must be a string',
          required_error: 'Name is required',
        })
        .trim()
        .min(1, { message: 'Name must be at least 1 character' }),
      description: z
        .string({
          description: 'Description of the room',
          invalid_type_error: 'Description must be a string',
        })
        .trim()
        .optional(),
      layouts: z
        .array(
          z.object({
            description: z
              .string({
                description: 'Description of the room layout',
                invalid_type_error: 'Description must be a string',
              })
              .trim()
              .optional(),
          }),
        )
        .optional(),
    });
  }
}

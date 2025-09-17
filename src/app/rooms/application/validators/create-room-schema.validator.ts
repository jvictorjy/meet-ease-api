import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

export class CreateRoomSchemaValidator implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return z
      .object({
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
        max_capacity: z.coerce
          .number({
            description: 'The maximum capacity of the room',
            invalid_type_error: 'max_capacity must be a number',
            required_error: 'max_capacity is required',
          })
          .int({ message: 'max_capacity must be an integer' })
          .min(1, { message: 'max_capacity must be a positive integer' }),
        opening_time: z
          .string({
            description: 'Opening time in HH:mm format',
            invalid_type_error: 'opening_time must be a string',
            required_error: 'opening_time is required',
          })
          .regex(timeRegex, {
            message: 'Horário inválido. Use o formato HH:mm.',
          }),
        closing_time: z
          .string({
            description: 'Closing time in HH:mm format',
            invalid_type_error: 'closing_time must be a string',
            required_error: 'closing_time is required',
          })
          .regex(timeRegex, {
            message: 'Horário inválido. Use o formato HH:mm.',
          }),
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
      })
      .superRefine((val, ctx) => {
        if (val.opening_time && val.closing_time) {
          if (val.opening_time >= val.closing_time) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'opening_time must be less than closing_time',
              path: ['opening_time'],
            });
          }
        }
      });
  }
}

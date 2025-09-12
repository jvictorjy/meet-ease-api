import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas/create-schema.interface';
import { z, ZodIssueCode } from 'zod';

export class ChangePasswordSchemaValidator implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    return z
      .object({
        password: z
          .string({
            description: 'Password',
            invalid_type_error: 'Password must be a string',
            required_error: 'Password is required',
          })
          .trim()
          .min(6, { message: 'Password must be at least 6 character' }),
        confirm_password: z
          .string({
            description: 'Confirm Password',
            invalid_type_error: 'Confirm Password must be a string',
            required_error: 'Confirm Password is required',
          })
          .trim()
          .min(6, { message: 'Confirm Password must be at least 6 character' }),
      })
      .superRefine((data, ctx) => {
        if (data.confirm_password !== data.password) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ['confirm_password'],
            message: 'Passwords do not match',
          });
        }
      });
  }
}

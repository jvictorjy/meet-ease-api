import { CreateValidationSchema } from '@app/common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

/**
 * Validation schema for creating a profile.
 *
 * This class defines the schema for validating the input data required
 * to create a profile. It ensures that the `role` field is a non-empty string
 * and that the optional `description` field, if provided, is also a non-empty string.
 */
export class CreateProfileSchemaValidator implements CreateValidationSchema {
  /**
   * Creates and returns the validation schema.
   *
   * @returns A Zod schema object for validating profile creation data.
   */
  createSchema(): z.ZodSchema {
    return z.object({
      /**
       * The role of the profile.
       * - Must be a string.
       * - Cannot be empty.
       * - Minimum length: 1 character.
       */
      role: z
        .string({
          description: 'Role',
          invalid_type_error: 'Role must be a string',
          required_error: 'Role is required',
        })
        .trim()
        .min(1, { message: 'Role must be at least 1 character' }),

      /**
       * The description of the profile (optional).
       * - Must be a string if provided.
       * - Cannot be empty if provided.
       * - Minimum length: 1 character.
       */
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

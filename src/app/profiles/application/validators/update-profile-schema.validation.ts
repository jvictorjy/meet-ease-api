import { CreateValidationSchema } from '@app/common/application/validators/zod/schemas/create-schema.interface';
import { z } from 'zod';

/**
 * Validation schema for updating a profile.
 *
 * This class defines the schema for validating the input data required
 * to update a profile. It ensures that the optional `description` field,
 * if provided, is a non-empty string.
 */
export class UpdateProfileSchemaValidation implements CreateValidationSchema {
  /**
   * Creates and returns the validation schema.
   *
   * @returns A Zod schema object for validating profile update data.
   */
  createSchema(): z.ZodSchema {
    return z.object({
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

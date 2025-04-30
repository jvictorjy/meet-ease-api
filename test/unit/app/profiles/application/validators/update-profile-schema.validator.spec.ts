import { UpdateProfileSchemaValidator } from '@app/profiles/application/validators/update-profile-schema.validator';
import { ZodError } from 'zod';

describe('UpdateProfileSchemaValidator', () => {
  let validator: UpdateProfileSchemaValidator;

  beforeEach(() => {
    validator = new UpdateProfileSchemaValidator();
  });

  it('should validate valid profile data', () => {
    const schema = validator.createSchema();
    const data = {
      name: 'Test Profile',
      role: 'user',
      description: 'This is a test profile',
    };

    const result = schema.parse(data);

    expect(result).toEqual(data);
  });

  it('should validate profile data with only required fields', () => {
    const schema = validator.createSchema();
    const data = {
      name: 'Test Profile',
      role: 'user',
    };

    const result = schema.parse(data);

    expect(result).toEqual(data);
  });

  describe('name validation', () => {
    it('should throw an error when name is missing', () => {
      const schema = validator.createSchema();
      const data = { role: 'user', description: 'This is a test profile' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Role is required');
      }
    });

    it('should throw an error when name is empty', () => {
      const schema = validator.createSchema();
      const data = {
        name: '',
        role: 'user',
        description: 'This is a test profile',
      };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe(
          'Role must be at least 1 character',
        );
      }
    });

    it('should throw an error when name is not a string', () => {
      const schema = validator.createSchema();
      const data = {
        name: 123,
        role: 'user',
        description: 'This is a test profile',
      };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Role must be a string');
      }
    });

    it('should trim the name', () => {
      const schema = validator.createSchema();
      const data = { name: '  Test Profile  ', role: 'user' };

      const result = schema.parse(data);

      expect(result).toEqual({ name: 'Test Profile', role: 'user' });
    });
  });

  describe('role validation', () => {
    it('should throw an error when role is missing', () => {
      const schema = validator.createSchema();
      const data = {
        name: 'Test Profile',
        description: 'This is a test profile',
      };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Role is required');
      }
    });

    it('should throw an error when role is empty', () => {
      const schema = validator.createSchema();
      const data = {
        name: 'Test Profile',
        role: '',
        description: 'This is a test profile',
      };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe(
          'Role must be at least 1 character',
        );
      }
    });

    it('should throw an error when role is not a string', () => {
      const schema = validator.createSchema();
      const data = {
        name: 'Test Profile',
        role: 123,
        description: 'This is a test profile',
      };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Role must be a string');
      }
    });

    it('should trim the role', () => {
      const schema = validator.createSchema();
      const data = { name: 'Test Profile', role: '  user  ' };

      const result = schema.parse(data);

      expect(result).toEqual({ name: 'Test Profile', role: 'user' });
    });
  });

  describe('description validation', () => {
    it('should accept when description is missing', () => {
      const schema = validator.createSchema();
      const data = { name: 'Test Profile', role: 'user' };

      const result = schema.parse(data);

      expect(result).toEqual(data);
    });

    it('should throw an error when description is not a string', () => {
      const schema = validator.createSchema();
      const data = { name: 'Test Profile', role: 'user', description: 123 };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Description must be a string');
      }
    });

    it('should throw an error when description is empty', () => {
      const schema = validator.createSchema();
      const data = { name: 'Test Profile', role: 'user', description: '' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe(
          'Description must be at least 1 character',
        );
      }
    });

    it('should trim the description', () => {
      const schema = validator.createSchema();
      const data = {
        name: 'Test Profile',
        role: 'user',
        description: '  This is a test profile  ',
      };

      const result = schema.parse(data);

      expect(result).toEqual({
        name: 'Test Profile',
        role: 'user',
        description: 'This is a test profile',
      });
    });
  });
});

import { CreateAreaSchemaValidator } from '@app/areas/application/validators/create-area-schema.validator';
import { ZodError } from 'zod';

describe('CreateAreaSchemaValidator', () => {
  let validator: CreateAreaSchemaValidator;

  beforeEach(() => {
    validator = new CreateAreaSchemaValidator();
  });

  it('should validate valid area data', () => {
    const schema = validator.createSchema();
    const data = {
      name: 'Test Area',
      description: 'This is a test area',
      parent_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const result = schema.parse(data);

    expect(result).toEqual(data);
  });

  it('should validate area data with only required fields', () => {
    const schema = validator.createSchema();
    const data = {
      name: 'Test Area',
    };

    const result = schema.parse(data);

    expect(result).toEqual(data);
  });

  describe('name validation', () => {
    it('should throw an error when name is missing', () => {
      const schema = validator.createSchema();
      const data = { description: 'This is a test area' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Name is required');
      }
    });

    it('should throw an error when name is empty', () => {
      const schema = validator.createSchema();
      const data = { name: '', description: 'This is a test area' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe(
          'Name must be at least 1 character',
        );
      }
    });

    it('should throw an error when name is not a string', () => {
      const schema = validator.createSchema();
      const data = { name: 123, description: 'This is a test area' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Name must be a string');
      }
    });

    it('should trim the name', () => {
      const schema = validator.createSchema();
      const data = { name: '  Test Area  ' };

      const result = schema.parse(data);

      expect(result).toEqual({ name: 'Test Area' });
    });
  });

  describe('description validation', () => {
    it('should accept when description is missing', () => {
      const schema = validator.createSchema();
      const data = { name: 'Test Area' };

      const result = schema.parse(data);

      expect(result).toEqual(data);
    });

    it('should throw an error when description is not a string', () => {
      const schema = validator.createSchema();
      const data = { name: 'Test Area', description: 123 };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Description must be a string');
      }
    });

    it('should trim the description', () => {
      const schema = validator.createSchema();
      const data = {
        name: 'Test Area',
        description: '  This is a test area  ',
      };

      const result = schema.parse(data);

      expect(result).toEqual({
        name: 'Test Area',
        description: 'This is a test area',
      });
    });
  });

  describe('parent_id validation', () => {
    it('should accept when parent_id is missing', () => {
      const schema = validator.createSchema();
      const data = { name: 'Test Area' };

      const result = schema.parse(data);

      expect(result).toEqual(data);
    });

    it('should throw an error when parent_id is not a string', () => {
      const schema = validator.createSchema();
      const data = { name: 'Test Area', parent_id: 123 };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Parent ID must be a string');
      }
    });

    it('should throw an error when parent_id is not a valid UUID', () => {
      const schema = validator.createSchema();
      const data = { name: 'Test Area', parent_id: 'not-a-uuid' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Parent ID must be a valid UUID');
      }
    });
  });
});

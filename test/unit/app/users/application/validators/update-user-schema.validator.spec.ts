import { UpdateUserSchemaValidator } from '@app/users/application/validators/update-user-schema.validator';

describe('UpdateUserSchemaValidator', () => {
  let validator: UpdateUserSchemaValidator;

  beforeEach(() => {
    validator = new UpdateUserSchemaValidator();
  });

  describe('createSchema', () => {
    it('should validate a valid input', () => {
      const schema = validator.createSchema();
      const input = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      };

      expect(() => schema.parse(input)).not.toThrow();
    });

    it('should fail if name is missing', () => {
      const schema = validator.createSchema();
      const input = {
        email: 'john.doe@example.com',
        phone: '1234567890',
      };

      expect(() => schema.parse(input)).toThrowError('Name is required');
    });

    it('should fail if email is missing', () => {
      const schema = validator.createSchema();
      const input = {
        name: 'John Doe',
        phone: '1234567890',
      };

      expect(() => schema.parse(input)).toThrowError('Email is required');
    });

    it('should fail if phone is missing', () => {
      const schema = validator.createSchema();
      const input = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      expect(() => schema.parse(input)).toThrowError('Phone is required');
    });

    it('should fail if name is not a string', () => {
      const schema = validator.createSchema();
      const input = {
        name: 123,
        email: 'john.doe@example.com',
        phone: '1234567890',
      };

      expect(() => schema.parse(input)).toThrowError('Name must be a string');
    });

    it('should fail if email is not a string', () => {
      const schema = validator.createSchema();
      const input = {
        name: 'John Doe',
        email: 123,
        phone: '1234567890',
      };

      expect(() => schema.parse(input)).toThrowError('Email must be a string');
    });

    it('should fail if phone is not a string', () => {
      const schema = validator.createSchema();
      const input = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: 123,
      };

      expect(() => schema.parse(input)).toThrowError('Phone must be a string');
    });

    it('should fail if email format is invalid', () => {
      const schema = validator.createSchema();
      const input = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '1234567890',
      };

      expect(() => schema.parse(input)).toThrowError('Invalid email address');
    });

    it('should fail if name is empty', () => {
      const schema = validator.createSchema();
      const input = {
        name: '',
        email: 'john.doe@example.com',
        phone: '1234567890',
      };

      expect(() => schema.parse(input)).toThrowError(
        'Name must be at least 1 character',
      );
    });

    it('should fail if email is empty', () => {
      const schema = validator.createSchema();
      const input = {
        name: 'John Doe',
        email: '',
        phone: '1234567890',
      };

      expect(() => schema.parse(input)).toThrowError(
        'Email must be at least 1 character',
      );
    });

    it('should fail if phone is empty', () => {
      const schema = validator.createSchema();
      const input = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '',
      };

      expect(() => schema.parse(input)).toThrowError(
        'Phone must be at least 1 character',
      );
    });

    it('should fail for unknown fields', () => {
      const schema = validator.createSchema();
      const input = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        unknownField: 'test',
      };

      expect(() => schema.parse(input)).toThrowError(
        "Unrecognized key(s) in object: 'unknownField'",
      );
    });
  });
});

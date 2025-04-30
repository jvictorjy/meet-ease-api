import { SignInSchemaValidators } from '@app/auth/application/validators/sign-in.schema.validators';
import { ZodError } from 'zod';

describe('SignInSchemaValidators', () => {
  let validator: SignInSchemaValidators;

  beforeEach(() => {
    validator = new SignInSchemaValidators();
  });

  it('should validate valid sign-in data', () => {
    const schema = validator.createSchema();
    const data = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = schema.parse(data);

    expect(result).toEqual(data);
  });

  describe('email validation', () => {
    it('should throw an error when email is missing', () => {
      const schema = validator.createSchema();
      const data = { password: 'password123' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Email is required');
      }
    });

    it('should throw an error when email is empty', () => {
      const schema = validator.createSchema();
      const data = { email: '', password: 'password123' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe(
          'Email must be at least 1 character',
        );
      }
    });

    it('should throw an error when email is not a string', () => {
      const schema = validator.createSchema();
      const data = { email: 123, password: 'password123' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Email must be a string');
      }
    });

    it('should throw an error when email is not valid', () => {
      const schema = validator.createSchema();
      const data = { email: 'not-an-email', password: 'password123' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('This is not a valid email.');
      }
    });

    it('should trim the email', () => {
      const schema = validator.createSchema();
      const data = { email: '  test@example.com  ', password: 'password123' };

      const result = schema.parse(data);

      expect(result).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('password validation', () => {
    it('should throw an error when password is missing', () => {
      const schema = validator.createSchema();
      const data = { email: 'test@example.com' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Password is required');
      }
    });

    it('should throw an error when password is empty', () => {
      const schema = validator.createSchema();
      const data = { email: 'test@example.com', password: '' };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe(
          'Password must be at least 1 character',
        );
      }
    });

    it('should throw an error when password is not a string', () => {
      const schema = validator.createSchema();
      const data = { email: 'test@example.com', password: 123 };

      expect(() => schema.parse(data)).toThrow(ZodError);

      try {
        schema.parse(data);
      } catch (error) {
        expect(error.errors[0].message).toBe('Password must be a string');
      }
    });

    it('should trim the password', () => {
      const schema = validator.createSchema();
      const data = { email: 'test@example.com', password: '  password123  ' };

      const result = schema.parse(data);

      expect(result).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});

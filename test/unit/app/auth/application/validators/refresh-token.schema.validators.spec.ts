import { RefreshTokenSchemaValidators } from '@app/auth/application/validators/refresh-token.schema.validators';
import { ZodError } from 'zod';

describe('RefreshTokenSchemaValidators', () => {
  let validator: RefreshTokenSchemaValidators;

  beforeEach(() => {
    validator = new RefreshTokenSchemaValidators();
  });

  it('should validate a valid refresh token', () => {
    const schema = validator.createSchema();
    const data = { refreshToken: 'valid-token' };

    const result = schema.parse(data);

    expect(result).toEqual(data);
  });

  it('should throw an error when refresh token is missing', () => {
    const schema = validator.createSchema();
    const data = {};

    expect(() => schema.parse(data)).toThrow(ZodError);

    try {
      schema.parse(data);
    } catch (error) {
      expect(error.errors[0].message).toBe('Refresh Token is required');
    }
  });

  it('should throw an error when refresh token is empty', () => {
    const schema = validator.createSchema();
    const data = { refreshToken: '' };

    expect(() => schema.parse(data)).toThrow(ZodError);

    try {
      schema.parse(data);
    } catch (error) {
      expect(error.errors[0].message).toBe(
        'Refresh Token must be at least 1 character',
      );
    }
  });

  it('should throw an error when refresh token is not a string', () => {
    const schema = validator.createSchema();
    const data = { refreshToken: 123 };

    expect(() => schema.parse(data)).toThrow(ZodError);

    try {
      schema.parse(data);
    } catch (error) {
      expect(error.errors[0].message).toBe('Refresh Token must be a string');
    }
  });

  it('should trim the refresh token', () => {
    const schema = validator.createSchema();
    const data = { refreshToken: '  valid-token  ' };

    const result = schema.parse(data);

    expect(result).toEqual({ refreshToken: 'valid-token' });
  });
});

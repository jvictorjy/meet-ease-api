import { UpdateProfileSchemaValidation } from '@app/profiles/application/validators';

describe('UpdateProfileSchemaValidation', () => {
  let schemaValidation: UpdateProfileSchemaValidation;

  beforeEach(() => {
    schemaValidation = new UpdateProfileSchemaValidation();
  });

  it('validates successfully with a valid description', () => {
    const schema = schemaValidation.createSchema();
    const validData = { description: 'Valid description' };

    expect(() => schema.parse(validData)).not.toThrow();
  });

  it('validates successfully when description is not provided', () => {
    const schema = schemaValidation.createSchema();
    const validData = {};

    expect(() => schema.parse(validData)).not.toThrow();
  });

  it('throws an error when description is not a string', () => {
    const schema = schemaValidation.createSchema();
    const invalidData = { description: 123 };

    expect(() => schema.parse(invalidData)).toThrowError(
      'Description must be a string',
    );
  });

  it('throws an error when description is an empty string', () => {
    const schema = schemaValidation.createSchema();
    const invalidData = { description: '' };

    expect(() => schema.parse(invalidData)).toThrowError(
      'Description must be at least 1 character',
    );
  });

  it('trims and validates successfully when description has leading or trailing spaces', () => {
    const schema = schemaValidation.createSchema();
    const validData = { description: '  Valid description  ' };

    expect(() => schema.parse(validData)).not.toThrow();
  });
});

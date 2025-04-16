import { CreateProfileSchemaValidation } from '@app/profiles/application/validators/create-profile-schema.validation';

describe('CreateProfileSchemaValidation', () => {
  let schemaValidation: CreateProfileSchemaValidation;

  beforeEach(() => {
    schemaValidation = new CreateProfileSchemaValidation();
  });

  it('validates successfully with valid role and description', () => {
    const schema = schemaValidation.createSchema();
    const validData = { role: 'admin', description: 'Valid description' };

    expect(() => schema.parse(validData)).not.toThrow();
  });

  it('throws an error when role is missing', () => {
    const schema = schemaValidation.createSchema();
    const invalidData = { description: 'Valid description' };

    expect(() => schema.parse(invalidData)).toThrowError('Role is required');
  });

  it('throws an error when role is an empty string', () => {
    const schema = schemaValidation.createSchema();
    const invalidData = { role: '', description: 'Valid description' };

    expect(() => schema.parse(invalidData)).toThrowError(
      'Role must be at least 1 character',
    );
  });

  it('validates successfully when description is optional and not provided', () => {
    const schema = schemaValidation.createSchema();
    const validData = { role: 'admin' };

    expect(() => schema.parse(validData)).not.toThrow();
  });

  it('throws an error when description is not a string', () => {
    const schema = schemaValidation.createSchema();
    const invalidData = { role: 'admin', description: 123 };

    expect(() => schema.parse(invalidData)).toThrowError(
      'Description must be a string',
    );
  });

  it('throws an error when description is an empty string', () => {
    const schema = schemaValidation.createSchema();
    const invalidData = { role: 'admin', description: '' };

    expect(() => schema.parse(invalidData)).toThrowError(
      'Description must be at least 1 character',
    );
  });
});

import { UpdateUserSchemaValidator } from '@app/users/application/validators/update-user-schema.validator';

describe('UpdateUserSchemaValidator', () => {
  let validator: UpdateUserSchemaValidator;

  beforeEach(() => {
    validator = new UpdateUserSchemaValidator();
  });

  it('should validate a valid user data', () => {
    // Arrange
    const validUserData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    };

    // Act
    const schema = validator.createSchema();
    const result = schema.safeParse(validUserData);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validUserData);
    }
  });

  it('should validate with trimmed strings', () => {
    // Arrange
    const userDataWithSpaces = {
      name: '  Test User  ',
      email: '  test@example.com  ',
      phone: '  1234567890  ',
    };

    const expectedTrimmedData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    };

    // Act
    const schema = validator.createSchema();
    const result = schema.safeParse(userDataWithSpaces);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(expectedTrimmedData);
    }
  });

  it('should fail when name is missing', () => {
    // Arrange
    const invalidUserData = {
      email: 'test@example.com',
      phone: '1234567890',
    };

    // Act
    const schema = validator.createSchema();
    const result = schema.safeParse(invalidUserData);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name');
      expect(result.error.issues[0].message).toBe('Name is required');
    }
  });

  it('should fail when email is invalid', () => {
    // Arrange
    const invalidUserData = {
      name: 'Test User',
      email: 'invalid-email',
      phone: '1234567890',
    };

    // Act
    const schema = validator.createSchema();
    const result = schema.safeParse(invalidUserData);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
      expect(result.error.issues[0].message).toBe('Invalid email address');
    }
  });

  it('should fail when phone is missing', () => {
    // Arrange
    const invalidUserData = {
      name: 'Test User',
      email: 'test@example.com',
    };

    // Act
    const schema = validator.createSchema();
    const result = schema.safeParse(invalidUserData);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('phone');
      expect(result.error.issues[0].message).toBe('Phone is required');
    }
  });

  it('should fail when name is too short', () => {
    // Arrange
    const invalidUserData = {
      name: '',
      email: 'test@example.com',
      phone: '1234567890',
    };

    // Act
    const schema = validator.createSchema();
    const result = schema.safeParse(invalidUserData);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name');
      expect(result.error.issues[0].message).toBe(
        'Name must be at least 1 character',
      );
    }
  });

  it('should fail when additional properties are provided', () => {
    // Arrange
    const invalidUserData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      extraField: 'This should not be allowed',
    };

    // Act
    const schema = validator.createSchema();
    const result = schema.safeParse(invalidUserData);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      const unexpectedPropertyError = result.error.issues.find(
        (issue) => issue.code === 'unrecognized_keys',
      );
      expect(unexpectedPropertyError).toBeDefined();
      expect(unexpectedPropertyError.keys).toContain('extraField');
    }
  });

  it('should fail with multiple validation errors', () => {
    // Arrange
    const invalidUserData = {
      name: '',
      email: 'invalid-email',
      phone: '',
      extraField: 'This should not be allowed',
    };

    // Act
    const schema = validator.createSchema();
    const result = schema.safeParse(invalidUserData);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(1);
    }
  });
});

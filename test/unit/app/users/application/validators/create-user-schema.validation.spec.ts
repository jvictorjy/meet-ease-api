import { CreateUserSchemaValidation } from '@app/users/application/validators/create-user-schema.validation';

describe('CreateUserSchemaValidation', () => {
  it('fails validation when name is empty', () => {
    const schema = new CreateUserSchemaValidation().createSchema();
    const data = {
      name: '',
      email: 'john.doe@example.com',
      phone: '1234567890',
      password: 'password123',
      confirm_password: 'password123',
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['name'],
          message: 'Name must be at least 1 character',
        }),
      ]),
    );
  });

  it('fails validation when phone is empty', () => {
    const schema = new CreateUserSchemaValidation().createSchema();
    const data = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '',
      password: 'password123',
      confirm_password: 'password123',
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['phone'],
          message: 'Phone must be at least 1 character',
        }),
      ]),
    );
  });

  it('fails validation when confirm_password is too short', () => {
    const schema = new CreateUserSchemaValidation().createSchema();
    const data = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      password: 'password123',
      confirm_password: '123',
    };

    const result = schema.safeParse(data);

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['confirm_password'],
          message: 'Confirm Password must be at least 6 character',
        }),
      ]),
    );
  });
});

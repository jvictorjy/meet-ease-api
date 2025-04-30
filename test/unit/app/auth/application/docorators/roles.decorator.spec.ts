import { Reflector } from '@nestjs/core';
import { Roles } from '@app/auth/application/docorators/roles.decorator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

// Since we can't easily test the decorator directly, we'll test the functionality
// by using the decorator on a class and then checking the metadata
describe('Roles Decorator', () => {
  it('should set metadata with the provided roles', () => {
    // Create a class with a method that has the Roles decorator
    class TestController {
      @Roles(RoleName.ADMIN, RoleName.LEADER)
      testMethod() {}
    }

    // Use a Reflector to get the metadata
    const reflector = new Reflector();
    const roles = reflector.get<RoleName[]>(
      'roles',
      TestController.prototype.testMethod,
    );

    // Verify that the roles were correctly set
    expect(roles).toEqual([RoleName.ADMIN, RoleName.LEADER]);
  });

  it('should set metadata with an empty array when no roles are provided', () => {
    // Create a class with a method that has the Roles decorator with no roles
    class TestController {
      @Roles()
      testMethod() {}
    }

    // Use a Reflector to get the metadata
    const reflector = new Reflector();
    const roles = reflector.get<RoleName[]>(
      'roles',
      TestController.prototype.testMethod,
    );

    expect(roles).toEqual([]);
  });

  it('should allow multiple roles to be specified', () => {
    class TestController {
      @Roles(RoleName.ADMIN, RoleName.LEADER)
      testMethod() {}
    }

    const reflector = new Reflector();
    const roles = reflector.get<RoleName[]>(
      'roles',
      TestController.prototype.testMethod,
    );

    expect(roles).toEqual([RoleName.ADMIN, RoleName.LEADER]);
  });
});

import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('RoleName Enum', () => {
  it('should be defined', () => {
    expect(RoleName).toBeDefined();
  });

  it('should have the correct values', () => {
    expect(RoleName.ADMIN).toBe('ADMIN');
    expect(RoleName.CORE).toBe('CORE');
    expect(RoleName.LEADER).toBe('LEADER');
    expect(RoleName.SCHEDULER).toBe('SCHEDULER');
  });

  it('should have the correct number of roles', () => {
    const roleCount = Object.keys(RoleName).length;
    expect(roleCount).toBe(4);
  });

  it('should not have additional roles', () => {
    const expectedRoles = ['ADMIN', 'CORE', 'LEADER', 'SCHEDULER'];
    const actualRoles = Object.values(RoleName);

    expect(actualRoles).toEqual(expectedRoles);
  });
});

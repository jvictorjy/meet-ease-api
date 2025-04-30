import { ProfileAggregateMapper } from '@app/profiles/domain/mappers/profile-aggregate.mapper';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('ProfileAggregateMapper', () => {
  let mapper: ProfileAggregateMapper;

  beforeEach(() => {
    mapper = new ProfileAggregateMapper();
  });

  describe('mapToAggregate', () => {
    it('should map a Profile entity to a ProfileModel', async () => {
      // Arrange
      const id = 'profile-id';
      const name = 'Test Profile';
      const description = 'Test Description';
      const role = 'user' as RoleName;
      const created_at = new Date();
      const updated_at = new Date();

      const profileEntity = new Profile(
        id,
        name,
        description,
        role,
        created_at,
        updated_at,
      );

      // Act
      const result = await mapper.mapToAggregate(profileEntity);

      // Assert
      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe(id);
      expect(result.name).toBe(name);
      expect(result.description).toBe(description);
      expect(result.role).toBe(role);
    });

    it('should handle empty description', async () => {
      // Arrange
      const id = 'profile-id';
      const name = 'Test Profile';
      const description = '';
      const role = 'user' as RoleName;
      const created_at = new Date();
      const updated_at = new Date();

      const profileEntity = new Profile(
        id,
        name,
        description,
        role,
        created_at,
        updated_at,
      );

      // Act
      const result = await mapper.mapToAggregate(profileEntity);

      // Assert
      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe(id);
      expect(result.name).toBe(name);
      expect(result.description).toBe(description);
      expect(result.role).toBe(role);
    });

    it('should set default values for createdAt and updatedAt if not provided', async () => {
      // Arrange
      const profileEntity = {
        id: 'profile-id',
        name: 'Test Profile',
        description: 'Test Description',
        role: 'user',
        createdAt: undefined,
        updatedAt: undefined,
      } as unknown as Profile;

      // Act
      const result = await mapper.mapToAggregate(profileEntity);

      // Assert
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('mapCollection', () => {
    it('should map an array of Profile entities to an array of ProfileModels', async () => {
      // Arrange
      const profile1 = new Profile(
        'profile-1',
        'Profile 1',
        'Description 1',
        'user' as RoleName,
        new Date(),
        new Date(),
      );

      const profile2 = new Profile(
        'profile-2',
        'Profile 2',
        'Description 2',
        'admin' as RoleName,
        new Date(),
        new Date(),
      );

      const profiles = [profile1, profile2];

      // Act
      const result = await mapper.mapCollection(profiles);

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('profile-1');
      expect(result[0].name).toBe('Profile 1');
      expect(result[1].id).toBe('profile-2');
      expect(result[1].name).toBe('Profile 2');
      expect(result[1].role).toBe('admin');
    });

    it('should return an empty array when given an empty array', async () => {
      // Arrange
      const profiles: Profile[] = [];

      // Act
      const result = await mapper.mapCollection(profiles);

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});

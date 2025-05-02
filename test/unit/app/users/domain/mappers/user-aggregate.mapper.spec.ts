import { UserAggregateMapper } from '@app/users/domain/mappers/user-aggregate.mapper';
import { User } from '@app/users/domain/entities/user.entity';
import { Profile } from '@app/profiles/domain/entities/profile.entity';

describe('UserAggregateMapper', () => {
  let mapper: UserAggregateMapper;

  beforeEach(() => {
    mapper = new UserAggregateMapper();
  });

  describe('mapToAggregate', () => {
    it('should map User and Profile entities to UserModel', async () => {
      // Arrange
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');

      const userEntity = new User(
        'user-id',
        'Test User',
        'test@example.com',
        '1234567890',
        'hashed-password',
        'profile-id',
        createdAt,
        updatedAt,
      );

      const profileEntity = {
        id: 'profile-id',
        name: 'Test Profile',
        _some_field: 'some value',
      } as unknown as Profile;

      // Act
      const result = await mapper.mapToAggregate(userEntity, profileEntity);

      // Assert
      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe('user-id');
      expect(result.name).toBe('Test User');
      expect(result.email).toBe('test@example.com');
      expect(result.phone).toBe('1234567890');
      expect(result.profile).toEqual({
        id: 'profile-id',
        name: 'Test Profile',
        some_field: 'some value',
      });
      expect(result.createdAt).toEqual(createdAt);
      expect(result.updatedAt).toEqual(updatedAt);
    });

    it('should handle entities with underscore-prefixed properties', async () => {
      // Arrange
      const userEntity = {
        _id: 'user-id',
        _name: 'Test User',
        _email: 'test@example.com',
        _phone: '1234567890',
        _password: 'hashed-password',
        _profile_id: 'profile-id',
        _created_at: new Date('2023-01-01'),
        _updated_at: new Date('2023-01-02'),
      } as unknown as User;

      const profileEntity = {
        _id: 'profile-id',
        _name: 'Test Profile',
      } as unknown as Profile;

      // Act
      const result = await mapper.mapToAggregate(userEntity, profileEntity);

      // Assert
      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe('user-id');
      expect(result.name).toBe('Test User');
      expect(result.email).toBe('test@example.com');
      expect(result.phone).toBe('1234567890');
      expect(result.profile).toEqual({
        id: 'profile-id',
        name: 'Test Profile',
      });
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle missing created_at and updated_at by providing default dates', async () => {
      // Arrange
      const userEntity = {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'hashed-password',
        profile_id: 'profile-id',
        // No created_at or updated_at
      } as unknown as User;

      const profileEntity = {
        id: 'profile-id',
        name: 'Test Profile',
      } as unknown as Profile;

      // Act
      const result = await mapper.mapToAggregate(userEntity, profileEntity);

      // Assert
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle null or undefined entities', async () => {
      // Arrange
      const userEntity = null as unknown as User;
      const profileEntity = undefined as unknown as Profile;

      // Act & Assert
      await expect(
        mapper.mapToAggregate(userEntity, profileEntity),
      ).resolves.toEqual({
        id: undefined,
        name: undefined,
        email: undefined,
        phone: undefined,
        profile: {},
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('mapCollection', () => {
    it('should map an array of users to an array of UserModels', async () => {
      // Arrange
      const users = [
        {
          id: 'user-id-1',
          name: 'Test User 1',
          email: 'test1@example.com',
          phone: '1234567890',
          password: 'hashed-password-1',
          profile_id: 'profile-id-1',
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-02'),
          profile: {
            id: 'profile-id-1',
            name: 'Test Profile 1',
          },
        },
        {
          id: 'user-id-2',
          name: 'Test User 2',
          email: 'test2@example.com',
          phone: '0987654321',
          password: 'hashed-password-2',
          profile_id: 'profile-id-2',
          created_at: new Date('2023-01-03'),
          updated_at: new Date('2023-01-04'),
          profile: {
            id: 'profile-id-2',
            name: 'Test Profile 2',
          },
        },
      ];

      // Act
      const result = await mapper.mapCollection(users);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('user-id-1');
      expect(result[0].name).toBe('Test User 1');
      expect(result[0].profile.id).toBe('profile-id-1');
      expect(result[1].id).toBe('user-id-2');
      expect(result[1].name).toBe('Test User 2');
      expect(result[1].profile.id).toBe('profile-id-2');
    });

    it('should return an empty array when given an empty array', async () => {
      // Arrange
      const users: any[] = [];

      // Act
      const result = await mapper.mapCollection(users);

      // Assert
      expect(result).toEqual([]);
    });
  });
});

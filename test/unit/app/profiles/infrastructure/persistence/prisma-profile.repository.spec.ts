import { PrismaProfileRepository } from '@app/profiles/infrastructure/persistence/prisma-profile.repository';
import { ProfileAggregateMapper } from '@app/profiles/domain/mappers/profile-aggregate.mapper';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { ProfileModel } from '@app/profiles/domain/models/profile.model';
import { PrismaClient } from '@prisma/client';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    profile: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('PrismaProfileRepository', () => {
  let prismaProfileRepository: PrismaProfileRepository;
  let profileMapper: jest.Mocked<ProfileAggregateMapper>;
  let prismaClient: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock ProfileAggregateMapper
    profileMapper = {
      mapToAggregate: jest.fn(),
      mapCollection: jest.fn(),
    } as unknown as jest.Mocked<ProfileAggregateMapper>;

    // Create repository instance
    prismaProfileRepository = new PrismaProfileRepository(profileMapper);

    // Get the mocked PrismaClient instance
    prismaClient = (PrismaClient as jest.Mock).mock.results[0].value;
  });

  describe('create', () => {
    it('should create a profile successfully', async () => {
      // Arrange
      const profileData = new Profile(
        'profile-id',
        'Test Profile',
        'Test Description',
        RoleName.ADMIN,
        new Date(),
        new Date(),
      );

      // Mock the return value of prismaClient.profile.create
      prismaClient.profile.create.mockResolvedValue({
        id: 'profile-id',
        name: 'Test Profile',
        description: 'Test Description',
        role: RoleName.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await prismaProfileRepository.create(profileData);

      expect(prismaClient.profile.create).toHaveBeenCalledWith({
        data: {
          id: profileData.id,
          name: profileData.name,
          description: profileData.description,
          role: profileData.role,
          created_at: profileData.createdAt,
          updated_at: profileData.updatedAt,
        },
      });
    });

    it('should handle errors during creation', async () => {
      // Arrange
      const profileData = new Profile(
        'profile-id',
        'Test Profile',
        'Test Description',
        RoleName.ADMIN,
        new Date(),
        new Date(),
      );

      prismaClient.profile.create.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(prismaProfileRepository.create(profileData)).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a profile successfully', async () => {
      // Arrange
      const profileData = new Profile(
        'profile-id',
        'Updated Profile',
        'Updated Description',
        RoleName.ADMIN,
        new Date(),
        new Date(),
      );

      // Act
      await prismaProfileRepository.update(profileData);

      // Assert
      expect(prismaClient.profile.update).toHaveBeenCalledWith({
        where: { id: profileData.id },
        data: {
          name: profileData.name,
          description: profileData.description,
          role: profileData.role,
          updated_at: expect.any(Date),
        },
      });
    });

    it('should handle errors during update', async () => {
      // Arrange
      const profileData = new Profile(
        'profile-id',
        'Updated Profile',
        'Updated Description',
        RoleName.ADMIN,
        new Date(),
        new Date(),
      );

      prismaClient.profile.update.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(prismaProfileRepository.update(profileData)).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });

  describe('findById', () => {
    it('should find a profile by id and return the mapped result', async () => {
      // Arrange
      const profileId = 'profile-id';
      const prismaProfile = {
        id: profileId,
        name: 'Test Profile',
        description: 'Test Description',
        role: RoleName.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const expectedProfileModel: ProfileModel = {
        id: profileId,
        name: 'Test Profile',
        description: 'Test Description',
        role: RoleName.ADMIN,
        createdAt: prismaProfile.created_at,
        updatedAt: prismaProfile.updated_at,
      };

      prismaClient.profile.findUnique.mockResolvedValue(prismaProfile);
      profileMapper.mapToAggregate.mockResolvedValue(expectedProfileModel);

      // Act
      const result = await prismaProfileRepository.findById(profileId);

      // Assert
      expect(prismaClient.profile.findUnique).toHaveBeenCalledWith({
        where: { id: profileId },
      });
      expect(profileMapper.mapToAggregate).toHaveBeenCalledWith(
        expect.any(Profile),
      );
      expect(result).toEqual(expectedProfileModel);
    });

    it('should return null when profile is not found', async () => {
      // Arrange
      const profileId = 'non-existent-profile-id';
      prismaClient.profile.findUnique.mockResolvedValue(null);

      // Act
      const result = await prismaProfileRepository.findById(profileId);

      // Assert
      expect(prismaClient.profile.findUnique).toHaveBeenCalledWith({
        where: { id: profileId },
      });
      expect(result).toBeNull();
    });

    it('should handle errors during findById', async () => {
      // Arrange
      const profileId = 'profile-id';
      prismaClient.profile.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(prismaProfileRepository.findById(profileId)).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should find all profiles and return the mapped results', async () => {
      // Arrange
      const prismaProfiles = [
        {
          id: 'profile-id-1',
          name: 'Test Profile 1',
          description: 'Test Description 1',
          role: RoleName.ADMIN,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'profile-id-2',
          name: 'Test Profile 2',
          description: 'Test Description 2',
          role: RoleName.CORE,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const expectedProfileModels: ProfileModel[] = [
        {
          id: 'profile-id-1',
          name: 'Test Profile 1',
          description: 'Test Description 1',
          role: RoleName.ADMIN,
          createdAt: prismaProfiles[0].created_at,
          updatedAt: prismaProfiles[0].updated_at,
        },
        {
          id: 'profile-id-2',
          name: 'Test Profile 2',
          description: 'Test Description 2',
          role: RoleName.CORE,
          createdAt: prismaProfiles[1].created_at,
          updatedAt: prismaProfiles[1].updated_at,
        },
      ];

      prismaClient.profile.findMany.mockResolvedValue(prismaProfiles);
      profileMapper.mapCollection.mockResolvedValue(expectedProfileModels);

      // Act
      const result = await prismaProfileRepository.findAll();

      // Assert
      expect(prismaClient.profile.findMany).toHaveBeenCalled();
      expect(profileMapper.mapCollection).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Profile), expect.any(Profile)]),
      );
      expect(result).toEqual(expectedProfileModels);
    });

    it('should handle errors during findAll', async () => {
      // Arrange
      prismaClient.profile.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(prismaProfileRepository.findAll()).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });

  describe('delete', () => {
    it('should delete a profile successfully', async () => {
      // Arrange
      const profileId = 'profile-id';

      // Act
      await prismaProfileRepository.delete(profileId);

      // Assert
      expect(prismaClient.profile.delete).toHaveBeenCalledWith({
        where: { id: profileId },
      });
    });

    it('should handle errors during deletion', async () => {
      // Arrange
      const profileId = 'profile-id';
      prismaClient.profile.delete.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(prismaProfileRepository.delete(profileId)).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Database error',
        }),
      );
    });
  });
});

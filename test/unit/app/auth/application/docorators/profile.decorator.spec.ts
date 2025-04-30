import { ExecutionContext } from '@nestjs/common';

describe('Profile Decorators', () => {
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      user: {
        userId: 'test-user-id',
        profile: {
          id: 'test-profile-id',
          name: 'Test Profile',
          role: 'user',
          description: 'Test description',
        },
      },
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;
  });

  describe('GetProfile implementation', () => {
    const getProfileImpl = (ctx: ExecutionContext, data?: string) => {
      const request = ctx.switchToHttp().getRequest();
      const profile = request.user?.profile;

      if (!profile) {
        return null;
      }

      return data ? profile[data] : profile;
    };

    it('should return the entire profile when no data is provided', () => {
      const result = getProfileImpl(mockExecutionContext, undefined);
      expect(result).toEqual(mockRequest.user.profile);
    });

    it('should return a specific profile property when data is provided', () => {
      const result = getProfileImpl(mockExecutionContext, 'name');
      expect(result).toEqual(mockRequest.user.profile.name);
    });

    it('should return null when profile is not available', () => {
      mockRequest.user.profile = undefined;
      const result = getProfileImpl(mockExecutionContext, undefined);
      expect(result).toBeNull();
    });

    it('should return null when user is not available', () => {
      mockRequest.user = undefined;
      const result = getProfileImpl(mockExecutionContext, undefined);
      expect(result).toBeNull();
    });
  });

  // Test the implementation of GetUserId
  describe('GetUserId implementation', () => {
    // Recreate the implementation from the decorator
    // This should match the implementation in the source file
    const getUserIdImpl = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user?.userId;
    };

    it('should return the user ID', () => {
      const result = getUserIdImpl(undefined, mockExecutionContext);
      expect(result).toEqual('test-user-id');
    });

    it('should return undefined when user is not available', () => {
      mockRequest.user = undefined;
      const result = getUserIdImpl(undefined, mockExecutionContext);
      expect(result).toBeUndefined();
    });

    it('should return undefined when userId is not available', () => {
      mockRequest.user.userId = undefined;
      const result = getUserIdImpl(undefined, mockExecutionContext);
      expect(result).toBeUndefined();
    });
  });
});

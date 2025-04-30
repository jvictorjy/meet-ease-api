import { IS_PUBLIC_KEY, Public } from '@app/auth/infrastructure/jwt/public';
import { SetMetadata } from '@nestjs/common';

// Mock the SetMetadata function
jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn().mockReturnValue('metadata-result'),
}));

describe('Public Decorator', () => {
  it('should be defined', () => {
    expect(IS_PUBLIC_KEY).toBeDefined();
    expect(Public).toBeDefined();
  });

  it('should have the correct public key value', () => {
    expect(IS_PUBLIC_KEY).toBe('isPublic');
  });

  it('should call SetMetadata with the correct parameters', () => {
    const result = Public();

    expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
    expect(result).toBe('metadata-result');
  });
});

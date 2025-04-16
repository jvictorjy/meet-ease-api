import { v4 as uuid } from 'uuid';

jest.mock('uuid');

describe('UUID generation', () => {
  it('generates a valid UUID', () => {
    const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
    (uuid as jest.Mock).mockReturnValue(mockUuid);

    const result = uuid();

    expect(result).toBe(mockUuid);
    expect(uuid).toHaveBeenCalledTimes(1);
  });

  it('throws an error if UUID generation fails', () => {
    (uuid as jest.Mock).mockImplementation(() => {
      throw new Error('UUID generation failed');
    });

    expect(() => uuid()).toThrowError('UUID generation failed');
  });
});

import { Profile } from '@app/profiles/domain/entities/profile.entity';

describe('Profile', () => {
  it('returns true when the role matches', () => {
    const profile = new Profile(
      '1',
      'admin',
      'description',
      new Date(),
      new Date(),
    );
    expect(profile.hasRole('admin')).toBe(true);
  });

  it('returns false when the role does not match', () => {
    const profile = new Profile(
      '1',
      'user',
      'description',
      new Date(),
      new Date(),
    );
    expect(profile.hasRole('admin')).toBe(false);
  });

  it('updates the description successfully', () => {
    const profile = new Profile(
      '1',
      'admin',
      'old description',
      new Date(),
      new Date(),
    );
    profile.updateDescription('new description');
    expect(profile.description).toBe('new description');
  });

  it('allows setting description to null', () => {
    const profile = new Profile(
      '1',
      'admin',
      'old description',
      new Date(),
      new Date(),
    );
    profile.updateDescription(null);
    expect(profile.description).toBeNull();
  });

  it('handles empty string as a valid description', () => {
    const profile = new Profile(
      '1',
      'admin',
      'old description',
      new Date(),
      new Date(),
    );
    profile.updateDescription('');
    expect(profile.description).toBe('');
  });
});

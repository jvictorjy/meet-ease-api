import { GetProfileUseCaseResponseDTO } from '@app/profiles/interfaces/http/dtos/get-profile.dtos';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('FindAllProfileUseCaseResponseDTO', () => {
  it('creates an instance with all required fields', () => {
    const dto = new GetProfileUseCaseResponseDTO();
    dto.id = '1';
    dto.role = 'admin';
    dto.description = 'Profile description';
    dto.created_at = new Date('2023-01-01');
    dto.updated_at = new Date('2023-01-02');

    expect(dto.id).toBe('1');
    expect(dto.role).toBe('admin');
    expect(dto.description).toBe('Profile description');
    expect(dto.created_at).toEqual(new Date('2023-01-01'));
    expect(dto.updated_at).toEqual(new Date('2023-01-02'));
  });

  it('allows description to be null', () => {
    const dto = new GetProfileUseCaseResponseDTO();
    dto.id = '1';
    dto.role = 'admin';
    dto.description = null;

    expect(dto.description).toBeNull();
  });

  it('allows description to be undefined', () => {
    const dto = new GetProfileUseCaseResponseDTO();
    dto.id = '1';
    dto.role = 'admin';

    expect(dto.description).toBeUndefined();
  });

  it('throws an error if id is accessed before being assigned', () => {
    const dto = new GetProfileUseCaseResponseDTO();

    expect(() => {
      if (!dto.id) {
        throw Exception.new({
          code: Code.BAD_REQUEST.code,
          overrideMessage: `id is required`,
        });
      }
    }).toThrow(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `id is required`,
      }),
    );
  });

  it('throws an error if created_at is accessed before being assigned', () => {
    const dto = new GetProfileUseCaseResponseDTO();

    expect(() => {
      if (!dto.created_at) {
        throw Exception.new({
          code: Code.BAD_REQUEST.code,
          overrideMessage: `created_at is required`,
        });
      }
    }).toThrow(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `created_at is required`,
      }),
    );
  });

  it('throws an error if updated_at is accessed before being assigned', () => {
    const dto = new GetProfileUseCaseResponseDTO();

    expect(() => {
      if (!dto.updated_at) {
        throw Exception.new({
          code: Code.BAD_REQUEST.code,
          overrideMessage: `updated_at is required`,
        });
      }
    }).toThrow(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `updated_at is required`,
      }),
    );
  });
});

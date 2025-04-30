import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenController } from '@app/auth/interfaces/http/controllers/refresh-token.controller';
import { RefreshTokenUseCase } from '@app/auth/application/use-cases/refresh-token.use-case';
import { RefreshTokenDto } from '@app/auth/interfaces/http/dtos/refresh-token.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { RefreshTokenSchemaValidators } from '@app/auth/application/validators/refresh-token.schema.validators';

describe('RefreshTokenController', () => {
  let controller: RefreshTokenController;
  let refreshTokenUseCase: RefreshTokenUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenController],
      providers: [
        {
          provide: RefreshTokenUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RefreshTokenController>(RefreshTokenController);
    refreshTokenUseCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  it('returns new tokens when use case executes successfully', async () => {
    const body: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    jest.spyOn(refreshTokenUseCase, 'execute').mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    const result = await controller.execute(body);

    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    expect(refreshTokenUseCase.execute).toHaveBeenCalledWith(body);
  });

  it('throws an error when use case throws a domain exception', async () => {
    const body: RefreshTokenDto = {
      refreshToken: 'invalid-refresh-token',
    };

    jest.spyOn(refreshTokenUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.UNAUTHORIZED.code,
        overrideMessage: 'Invalid refresh token',
      }),
    );

    await expect(controller.execute(body)).rejects.toThrow(
      'Invalid refresh token',
    );
  });

  it('throws an error when validation fails', async () => {
    // This test is a bit tricky because the validation happens in the pipe
    // We'll test that the pipe throws an exception when validation fails
    const invalidData = {
      refreshToken: '', // Empty refresh token should fail validation
    };

    const validationPipe = new ZodValidationPipe(
      new RefreshTokenSchemaValidators(),
    );

    await expect(validationPipe.transform(invalidData)).rejects.toThrowError();
  });
});

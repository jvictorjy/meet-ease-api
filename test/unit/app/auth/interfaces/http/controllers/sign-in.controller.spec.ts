import { Test, TestingModule } from '@nestjs/testing';
import { SignInController } from '@app/auth/interfaces/http/controllers/sign-in.controller';
import { SignInUseCase } from '@app/auth/application/use-cases/sign-in.use-case';
import { SignInDto } from '@app/auth/interfaces/http/dtos/sign-in.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { SignInSchemaValidators } from '@app/auth/application/validators/sign-in.schema.validators';

describe('SignInController', () => {
  let controller: SignInController;
  let signInUseCase: SignInUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignInController],
      providers: [
        {
          provide: SignInUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SignInController>(SignInController);
    signInUseCase = module.get<SignInUseCase>(SignInUseCase);
  });

  it('returns tokens and user info when use case executes successfully', async () => {
    const body: SignInDto = {
      email: 'user@example.com',
      password: 'password123',
    };

    jest.spyOn(signInUseCase, 'execute').mockResolvedValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { name: 'User Name', email: 'user@example.com' },
      profile: { name: 'User', role: 'USER', description: null },
    });

    const result = await controller.execute(body);

    expect(result).toMatchObject({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });

    expect(signInUseCase.execute).toHaveBeenCalledWith(body);
  });

  it('throws an error when use case throws a domain exception', async () => {
    const body: SignInDto = {
      email: 'user@example.com',
      password: 'password123',
    };

    jest.spyOn(signInUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.UNAUTHORIZED.code,
        overrideMessage: 'Invalid credentials',
      }),
    );

    await expect(controller.execute(body)).rejects.toThrow(
      'Invalid credentials',
    );
  });

  it('throws an error when validation fails', async () => {
    const invalidData = {
      email: 'not-an-email',
      password: '',
    };

    const validationPipe = new ZodValidationPipe(new SignInSchemaValidators());

    await expect(validationPipe.transform(invalidData)).rejects.toThrowError();
  });
});

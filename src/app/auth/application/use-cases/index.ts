import { SignInUseCase } from '@app/auth/application/use-cases/sign-in.use-case';
import { RefreshTokenUseCase } from '@app/auth/application/use-cases/refresh-token.use-case';

export const UseCases = [SignInUseCase, RefreshTokenUseCase];

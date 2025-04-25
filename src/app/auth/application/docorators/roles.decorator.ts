import { SetMetadata } from '@nestjs/common';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);

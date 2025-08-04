import { SetMetadata } from '@nestjs/common';
import { rolesEnum } from '../enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: rolesEnum[]) => SetMetadata(ROLES_KEY, roles);
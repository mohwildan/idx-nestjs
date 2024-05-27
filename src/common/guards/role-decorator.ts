import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../enums/role';

export const RoleAllowed = (...role: UserRoles[]) => SetMetadata('roles', role);

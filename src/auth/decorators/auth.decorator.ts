import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';
import { JwtAuthGuard, UserRoleGuard } from '../guards';
import { RoleProtected } from './role-protected.decorator';

export const Auth = (...roles: ValidRoles[]) => applyDecorators(
  RoleProtected(...roles),
  UseGuards(JwtAuthGuard, UserRoleGuard),
);
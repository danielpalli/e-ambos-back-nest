import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate = (context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> => {
    const validRoles: string[] = this.reflector.get( META_ROLES , context.getHandler() )

    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) throw new InternalServerErrorException('No se ha encontrado el usuario en la petición');
    
    for (const role of user.role ) {
      if ( validRoles.includes( role ) ) return true;
    }

    throw new ForbiddenException(
      'No tienes permisos para acceder a este recurso',
    );
  }
}

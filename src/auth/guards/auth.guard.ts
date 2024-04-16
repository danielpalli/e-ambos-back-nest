import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jtwService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    try {
      const payload = await this.jtwService.verifyAsync<JwtPayload>(token);
      const user = await this.userService.findUserById(payload.id);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
    return true;  
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

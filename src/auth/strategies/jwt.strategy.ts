import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthService } from '../auth.service';
import { envs } from 'src/config/envs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      secretOrKey: envs.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate = async (payload: JwtPayload): Promise<User> => {
    const { id } = payload;
    const user = await this.authService.validateUser(id);
    
    return user;
  }
}

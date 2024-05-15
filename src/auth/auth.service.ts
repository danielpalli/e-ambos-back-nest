import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { JwtPayload } from './interface/jwt-payload.interface';
import { AuthResponse, SignInRequest, SignUpRequest } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  signUp = async (signUpRequest: SignUpRequest): Promise<AuthResponse> => {
    const user = await this.usersService.create(signUpRequest);
    const token = this.getJwtToken({ id: user._id });

    return {
      user,
      token,
    };
  };

  signIn = async (signInRequest: SignInRequest): Promise<AuthResponse> => {
    const { email, password } = signInRequest;
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) 
      throw new UnauthorizedException('Credenciales inválidas');

    const { password: _, ...userData } = user.toJSON();
    const token = this.getJwtToken({ id: user._id });

    return {
      user: userData,
      token,
    };
  };

  validateUser = async (id: string): Promise<User> => {
    const user = await this.usersService.findUserById(id);

    if (!user) 
      throw new UnauthorizedException( `User not found` );

    if (!user.isActive)
      throw new UnauthorizedException(`El usuario no está activo`);
    
    return user;
  };

  private getJwtToken = (payload: JwtPayload) => {
    return this.jwtService.sign(payload);
  };

  checkToken = (user: User): AuthResponse => {
    const token = this.getJwtToken({ id: user!._id });

    return {
      user,
      token,
    };
  };
}

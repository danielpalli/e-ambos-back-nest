import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpRequest } from './dto/requests/signup.request';
import { AuthResponse } from './dto/responses/auth.response';
import { UsersService } from 'src/users/users.service';
import { SignInRequest } from './dto/requests/singin.request';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpRequest: SignUpRequest): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpRequest);

    return {
      user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  async signIn(signInRequest: SignInRequest): Promise<AuthResponse> {
    const { email, password } = signInRequest;
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password: _, ...userData } = user.toJSON();
    

    return {
      user: userData,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

}
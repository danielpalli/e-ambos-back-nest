import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpRequest } from './dto/requests/signup.request';
import { AuthResponse } from './dto/responses/auth.response';
import { UsersService } from 'src/users/users.service';
import { SignInRequest } from './dto/requests/singin.request';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpRequest: SignUpRequest): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpRequest);
    const token = this.getJwtToken({ id: user._id });
    return {
      user,
      token,
    };
  }

  async signIn(signInRequest: SignInRequest): Promise<AuthResponse> {
    const { email, password } = signInRequest;
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password: _, ...userData } = user.toJSON();
    const token = this.getJwtToken({ id: user._id });

    return {
      user: userData,
      token,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new UnauthorizedException(`User not found`);
    }

    if (!user.isActive) {
      throw new UnauthorizedException(`User is inactive, talk with an admin`);
    }

    return user;
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  checkToken(user: User): AuthResponse {
    const token = this.getJwtToken({ id: user!._id });
    
    return {
      user,
      token
    };
  }
}

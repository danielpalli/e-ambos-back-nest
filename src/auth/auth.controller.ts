import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, SignInRequest, SignUpRequest } from './dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { ValidRoles } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpRequest: SignUpRequest): Promise<AuthResponse> {
    return this.authService.signUp(signUpRequest);
  }

  @Post('sign-in')
  async signIn(@Body() signInRequest: SignInRequest): Promise<AuthResponse> {
    return this.authService.signIn(signInRequest);
  }

  @Get('check-token')
  @Auth(ValidRoles.USER)
  checkToken(@CurrentUser() user: User): AuthResponse {
    return this.authService.checkToken(user);
  }
}

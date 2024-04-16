import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, SignInRequest, SignUpRequest } from './dto';
import { AuthGuard } from './guards/auth.guard';


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

  @UseGuards(AuthGuard)
  @Get('check-token')
  checkToken(@Request() request: Request): AuthResponse {
    const user = request['user'];
    return { 
      user,
      token: this.authService.getJwtToken({ id: user._id }),
     };
  }
}

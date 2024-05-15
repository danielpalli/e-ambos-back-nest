import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInRequest {
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'El email debe ser un email válido' })
  email: string;
  
  @IsNotEmpty({ message: 'El password no puede estar vacío' })
  @MinLength(6, { message: 'El password debe tener al menos 6 caracteres' })
  password: string;
}
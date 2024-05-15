import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class SignUpRequest {
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  @Matches(/^[a-zA-Z]+$/, { message: 'El nombre debe contener solo letras' })
  firstName: string;

  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  @Matches(/^[a-zA-Z]+$/, { message: 'El apellido debe contener solo letras' })
  lastName: string;

  @IsEmail({}, { message: 'El email debe ser un email válido' })
  email: string;

  @MinLength(6, { message: 'El password debe tener al menos 6 caracteres' })
  @MaxLength(10, { message: 'El password no puede tener más de 10 caracteres' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'El password debe contener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial',
  })
  password: string;
}
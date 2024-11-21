import {
  IsNotEmpty,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Matches,
  IsString,
  IsOptional,
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const [rePasswordField] = args.constraints;
    const rePasswordValue = (args.object as any)[rePasswordField];
    return password === rePasswordValue;
  }

  defaultMessage() {
    return 'Password and re-password do not match';
  }
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message:
      'Username must contain only letters and numbers, without spaces or special characters',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Validate(PasswordMatchConstraint, ['re_password'])
  password: string;

  @IsString()
  @IsNotEmpty()
  re_password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

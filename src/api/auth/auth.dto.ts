import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}

export class LoginUserDTO {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;
}

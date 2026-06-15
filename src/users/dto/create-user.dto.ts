import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderTypes } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Password must be greater than 3 characters!' })
  @MaxLength(100)
  password: string;

  @IsEnum(GenderTypes, {
    message: 'Gender must be one of the following: male, female, others',
  })
  @IsNotEmpty()
  gender: GenderTypes;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  dateOfBirth: Date;
}

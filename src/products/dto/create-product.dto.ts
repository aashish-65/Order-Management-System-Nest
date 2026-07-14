import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Product name cannot be more than 100 characters.',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Description cannot be more than 100 characters.',
  })
  description: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have a maximum of 2 decimal places' },
  )
  @IsNotEmpty()
  @IsPositive()
  @Max(99999999.99)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stock: number;
}

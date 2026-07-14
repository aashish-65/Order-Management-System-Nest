import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class CheckoutItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @Max(99999999.99)
  unitPrice: number;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @IsNotEmpty()
  total: number;
}

import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'More than two decimal places.' },
  )
  @IsNotEmpty()
  @IsPositive()
  @Max(99999999.99, { message: 'Cannot be greater than 99999999.99.' })
  priceAtPurchase: number;
}

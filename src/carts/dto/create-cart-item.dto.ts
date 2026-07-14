import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;
}

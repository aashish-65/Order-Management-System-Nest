import { IsInt, IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';
import { CreateCartItemDto } from './create-cart-item.dto';
import { Type } from 'class-transformer';

export class CreateCartDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  cartId: number;

  @ValidateNested()
  @Type(() => CreateCartItemDto)
  @IsNotEmpty()
  items: CreateCartItemDto;
}

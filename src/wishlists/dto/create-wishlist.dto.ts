import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsInt({ message: 'User ID must be an integer' })
  @IsPositive({ message: 'User ID must be a positive number' })
  userId: number;

  @IsNotEmpty({ message: 'Product ID is required' })
  @IsInt({ message: 'Product ID must be an integer' })
  @IsPositive({ message: 'Product ID must be a positive number' })
  productId: number;
}

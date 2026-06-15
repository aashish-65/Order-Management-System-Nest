import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { OrderStatus } from '../entities/order.entity';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsEnum(OrderStatus, {
    message: 'Status must be one of the following: pending, shipped, delivered',
  })
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '../../payments/entities/payment.entity';
import { CheckoutItemDto } from './checkout-item.dto';
import { Type } from 'class-transformer';

export class CheckoutSummaryDto {
  @ValidateNested()
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have a maximum of 2 decimal places' },
  )
  @IsNotEmpty()
  @IsPositive()
  @Max(99999999.99)
  subTotal: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have a maximum of 2 decimal places' },
  )
  @IsNotEmpty()
  @IsPositive()
  @Max(9999.99)
  shippingCharge: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have a maximum of 2 decimal places' },
  )
  @IsNotEmpty()
  @IsPositive()
  @Max(999999.99)
  tax: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have a maximum of 2 decimal places' },
  )
  @IsNotEmpty()
  @IsPositive()
  @Max(99999999.99)
  grandTotal: number;

  @IsArray({ message: 'Payment methods must be an array' })
  @ArrayNotEmpty({ message: 'At least one payment method must be selected' })
  @IsEnum(PaymentMethod, {
    each: true,
    message:
      'Each payment method must be a valid option (upi, credit_card, etc.)',
  })
  paymentMethods: PaymentMethod[];
}

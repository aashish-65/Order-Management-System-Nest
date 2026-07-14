import { IsEnum, IsString } from 'class-validator';
import {
  PaymentMethod,
  ProviderTypes,
} from '../../payments/entities/payment.entity';

export class PlaceOrderDto {
  @IsString()
  @IsEnum(PaymentMethod, {
    message:
      'Each payment method must be a valid option (upi, credit_card, etc.)',
  })
  paymentMethod: PaymentMethod;

  @IsString()
  @IsEnum(ProviderTypes, {
    message: 'Each payment method must be a valid provider types.',
  })
  paymentProvider: ProviderTypes;
}

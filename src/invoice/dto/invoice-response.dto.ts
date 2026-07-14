import { CustomerDto } from './customer.dto';
import { InvoiceItemDto } from './invoice-item.dto';
import { OrderSummaryDto } from './order-summary.dto';
import { PaymentSummaryDto } from './payment-summary.dto';

export class InvoiceResponseDto {
  invoiceNumber: string;

  createdAt: Date;

  customer: CustomerDto;

  order: OrderSummaryDto;

  payment: PaymentSummaryDto;

  items: InvoiceItemDto[];

  subTotal: number;

  tax: number;

  shippingCharge: number;

  grandTotal: number;
}

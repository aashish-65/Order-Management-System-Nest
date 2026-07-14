export class PaymentSummaryDto {
  provider: string;

  paymentMethod: string;

  status: string;

  transactionId: string | null;
}
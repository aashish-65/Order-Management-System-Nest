import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get(':userId')
  getCheckoutSummary(@Param('userId', ParseIntPipe) userId: number) {
    return this.checkoutService.getCheckoutSummary(userId);
  }
}

import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../carts/entities/cart.entity';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService],
  imports: [TypeOrmModule.forFeature([Cart])],
  exports: [CheckoutService],
})
export class CheckoutModule {}

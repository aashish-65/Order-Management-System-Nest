import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../carts/entities/cart.entity';
import { Repository } from 'typeorm';
import { CheckoutItemDto } from './dto/checkout-item.dto';
import { CheckoutSummaryDto } from './dto/checkout-summary.dto';
import { PaymentMethod } from '../payments/entities/payment.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
  ) {}

  async getCartDetails(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  validateCart(cart: Cart): void {
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is Empty');
    }
    for (const item of cart.items) {
      if (item.product.stock <= 0) {
        throw new BadRequestException(
          `Item with id: ${item.id} whose product id: ${item.product.id} and productName: ${item.product.name} is out of stock.`,
        );
      } else if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Item with id: ${item.id} whose product id: ${item.product.id} and productName: ${item.product.name}, has quantity: ${item.quantity} but only ${item.product.stock} is available.`,
        );
      }
    }
  }

  prepareCheckoutItems(cart: Cart): {
    items: CheckoutItemDto[];
    subTotal: number;
  } {
    let subTotal = 0;

    const items = cart.items.map((item) => {
      const responseItemDto = new CheckoutItemDto();
      responseItemDto.productId = item.product.id;
      responseItemDto.productName = item.product.name;
      responseItemDto.quantity = item.quantity;
      responseItemDto.unitPrice = item.product.price;
      responseItemDto.total =
        responseItemDto.quantity * responseItemDto.unitPrice;
      subTotal += responseItemDto.total;
      return responseItemDto;
    });
    return {
      items,
      subTotal,
    };
  }

  calculateTax(subtotal: number): number {
    const GST_RATE = 0.18;

    return subtotal * GST_RATE;
  }

  calculateShippingCharge(subtotal: number): number {
    return subtotal >= 1000 ? 0 : 100;
  }

  calculateGrandTotal(
    subtotal: number,
    tax: number,
    shippingCharge: number,
  ): number {
    return subtotal + tax + shippingCharge;
  }

  buildCheckoutSummary(
    items: CheckoutItemDto[],
    subTotal: number,
    tax: number,
    shippingCharge: number,
    grandTotal: number,
  ): CheckoutSummaryDto {
    const summary = new CheckoutSummaryDto();

    summary.items = items;
    summary.subTotal = subTotal;
    summary.tax = tax;
    summary.shippingCharge = shippingCharge;
    summary.grandTotal = grandTotal;
    summary.paymentMethods = [PaymentMethod.CASH];

    return summary;
  }

  async getCheckoutSummary(userId: number) {
    //Step 1 : Fetch Cart Details
    const cart = await this.getCartDetails(userId);

    //Step 2 : Validate Cart empty, Stock and Quantity
    this.validateCart(cart);

    //Step 3 : Calculate subtotal and Prepare Item for Response
    const { items, subTotal } = this.prepareCheckoutItems(cart);

    //Step 4 : Calculate Tax
    const tax = this.calculateTax(subTotal);

    //Step 5 : Calculate Shipping Charges
    const shippingCharge = this.calculateShippingCharge(subTotal);

    //Step 6 : Calculate Grand Total
    const grandTotal = this.calculateGrandTotal(subTotal, tax, shippingCharge);

    //Step 7 : Create final Summary Dto.
    const responseSummary = this.buildCheckoutSummary(
      items,
      subTotal,
      tax,
      shippingCharge,
      grandTotal,
    );

    return responseSummary;
  }
}

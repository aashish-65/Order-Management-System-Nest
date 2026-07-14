import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { PlaceOrderDto } from './dto/place-order.dto';
import { CheckoutService } from '../checkout/checkout.service';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Product } from '../products/entities/product.entity';
import { CartItem } from '../carts/entities/cart-item.entity';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly checkoutService: CheckoutService,
    private readonly invoiceService: InvoiceService,
    private readonly dataSource: DataSource,
  ) {}
  async placeOrder(userId: number, placeOrderDto: PlaceOrderDto) {
    const cart = await this.checkoutService.getCartDetails(userId);

    this.checkoutService.validateCart(cart);

    const { subTotal } = this.checkoutService.prepareCheckoutItems(cart);

    const tax = this.checkoutService.calculateTax(subTotal);

    const shippingCharge =
      this.checkoutService.calculateShippingCharge(subTotal);

    const grandTotal = this.checkoutService.calculateGrandTotal(
      subTotal,
      tax,
      shippingCharge,
    );

    //Inside Transaction
    //1 create Order
    return await this.dataSource.transaction(async (manager) => {
      const newOrder = manager.create(Order, {
        user: cart.user,
        status: OrderStatus.PENDING,
        subTotal,
        tax,
        shippingCharge,
        grandTotal,
      });
      const savedOrder = await manager.save(newOrder);

      //2 Create OrderItems
      const newOrderItems = cart.items.map((item) => {
        const orderItem = manager.create(OrderItem, {
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
          order: savedOrder,
          product: item.product,
        });
        return orderItem;
      });

      await manager.save(newOrderItems);

      //3 Create Payment
      const paymentDetails = manager.create(Payment, {
        order: savedOrder,
        amount: grandTotal,
        provider: placeOrderDto.paymentProvider,
        paymentMethod: placeOrderDto.paymentMethod,
        status: PaymentStatus.PENDING,
      });

      const payment = await manager.save(paymentDetails);

      //4 Link Payement
      savedOrder.payment = payment;
      await manager.save(savedOrder);

      //5 Create Invoice
      const invoice = await this.invoiceService.createInvoice(
        manager,
        savedOrder,
        subTotal,
        tax,
        shippingCharge,
        grandTotal,
      );

      //6 Reduce Stock
      const productsToUpdate: Product[] = [];
      for (const item of cart.items) {
        const product = await manager.findOne(Product, {
          where: {
            id: item.product.id,
          },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with id ${item.product.id} not found.`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `${product.name} has only ${product.stock} items left in stock.`,
          );
        }
        product.stock -= item.quantity;
        productsToUpdate.push(product);
      }

      await manager.save(Product, productsToUpdate);

      //7 Clear Cart
      await manager.remove(CartItem, cart.items);

      //8 Return
      return {
        message: 'Order placed successfully',
        orderId: savedOrder.id,
      };
    });
  }

  async findAll() {
    const orders = await this.orderRepository.find();
    return { message: 'All Order Fetched', data: orders };
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      return { success: false, message: 'No order found for this order id.' };
    }
    return {
      success: true,
      message: 'Order Fetched Successfully',
      data: order,
    };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const isValidOrderId = await this.findOne(id);
    if (!isValidOrderId.success) {
      return isValidOrderId;
    }

    await this.orderRepository.update(id, updateOrderDto);
    return {
      success: true,
      message: 'Order Updated Successfully',
    };
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

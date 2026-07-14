import { Injectable, NotFoundException } from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';
import { EntityManager, Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { CustomerDto } from './dto/customer.dto';
import { OrderSummaryDto } from './dto/order-summary.dto';
import { PaymentSummaryDto } from './dto/payment-summary.dto';
import { InvoiceItemDto } from './dto/invoice-item.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  private mapInvoiceToDto(invoice: Invoice): InvoiceResponseDto {
    const response = new InvoiceResponseDto();

    // Invoice Details
    response.invoiceNumber = invoice.invoiceNumber;
    response.createdAt = invoice.createdAt;
    response.subTotal = Number(invoice.subTotal);
    response.tax = Number(invoice.tax);
    response.shippingCharge = Number(invoice.shippingCharge);
    response.grandTotal = Number(invoice.grandTotal);

    // Customer Details
    const customer = new CustomerDto();
    customer.id = invoice.order.user.id;
    customer.firstName = invoice.order.user.firstName;
    customer.lastName = invoice.order.user.lastName;
    customer.email = invoice.order.user.email;

    response.customer = customer;

    // Order Summary
    const order = new OrderSummaryDto();
    order.orderId = invoice.order.id;
    order.status = invoice.order.status;
    order.createdAt = invoice.order.createdAt;

    response.order = order;

    // Payment Summary
    const payment = new PaymentSummaryDto();
    payment.provider = invoice.order.payment.provider;
    payment.paymentMethod = invoice.order.payment.paymentMethod;
    payment.status = invoice.order.payment.status;
    payment.transactionId = invoice.order.payment.transactionId;

    response.payment = payment;

    // Order Items
    response.items = invoice.order.items.map((item) => {
      const invoiceItem = new InvoiceItemDto();

      invoiceItem.productId = item.product.id;
      invoiceItem.productName = item.product.name;
      invoiceItem.quantity = item.quantity;
      invoiceItem.unitPrice = Number(item.priceAtPurchase);
      invoiceItem.totalPrice = Number(item.priceAtPurchase) * item.quantity;

      return invoiceItem;
    });

    return response;
  }

  generateInvoiceNumber(): string {
    return `INV-${Date.now()}`;
  }

  async createInvoice(
    manager: EntityManager,
    order: Order,
    subTotal: number,
    tax: number,
    shippingCharge: number,
    grandTotal: number,
  ): Promise<Invoice> {
    const invoice = manager.create(Invoice, {
      invoiceNumber: this.generateInvoiceNumber(),
      order,
      subTotal,
      tax,
      shippingCharge,
      grandTotal,
    });

    return await manager.save(invoice);
  }

  async getInvoiceById(invoiceId: number): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: invoiceId,
      },
      relations: {
        order: {
          user: true,
          items: {
            product: true,
          },
          payment: true,
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${invoiceId} not found.`);
    }

    return this.mapInvoiceToDto(invoice);
  }

  async getInvoiceByOrderId(orderId: number): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        order: {
          id: orderId,
        },
      },
      relations: {
        order: {
          user: true,
          items: {
            product: true,
          },
          payment: true,
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice for order ${orderId} not found.`);
    }

    return this.mapInvoiceToDto(invoice);
  }
}

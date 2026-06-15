import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepositoty: Repository<OrderItem>,
    private readonly userService: UsersService,
    private readonly productService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, ...orderData } = createOrderDto;
    const user = await this.userService.findOne(userId);
    const newItems: OrderItem[] = [];
    for (let i: number = 0; i < items.length; i++) {
      const { productId, ...itemData } = items[i];
      const product = await this.productService.findOne(productId);

      const newItem = this.orderItemRepositoty.create({
        ...itemData,
        product: { ...product.data },
      });
      newItems.push(newItem);
    }
    let newOrder = this.orderRepository.create({
      ...orderData,
      items: newItems,
      user: { ...user.data },
    });

    newOrder = await this.orderRepository.save(newOrder);
    return { message: 'New Order Created', data: newOrder };
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

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}
  async addItemToCart(createCartDto: CreateCartDto) {
    const cart = await this.cartRepository.findOne({
      where: {
        id: createCartDto.cartId,
        user: {
          id: createCartDto.userId,
        },
      },
    });
    if (!cart) {
      return { message: 'Cart not found!' };
    } else {
      const item = await this.cartItemRepository.findOneBy({
        product: { id: createCartDto.items.productId },
        cart: { id: createCartDto.cartId },
      });

      if (item) {
        throw new BadRequestException('Item already exists in the cart');
      }
      // i am not checking the quantity of the product before adding it to the cart.
      let newItem = this.cartItemRepository.create({
        cart: { id: createCartDto.cartId },
        product: { id: createCartDto.items.productId },
        quantity: createCartDto.items.quantity,
      });

      newItem = await this.cartItemRepository.save(newItem);

      return newItem;
    }
  }

  async findOne(userId: number) {
    const cart = await this.cartRepository.findOneBy({
      user: { id: userId },
    });

    if (!cart) {
      return { message: 'No cart found !' };
    }

    return cart;
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto) {
    let item = await this.cartItemRepository.findOneBy({ id });

    if (!item) {
      return { message: 'This item is not available in the cart' };
    }

    item.quantity = updateCartItemDto.quantity;

    item = await this.cartItemRepository.save(item);
    return item;
  }

  async remove(id: number) {
    const item = await this.cartItemRepository.findOneBy({ id });
    if (!item) {
      return { message: 'Item not found!!' };
    }

    await this.cartItemRepository.delete(id);
    return { message: 'Item Deleted' };
  }
}

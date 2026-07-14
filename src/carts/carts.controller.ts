import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('items')
  addItemToCart(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.addItemToCart(createCartDto);
  }

  @Get(':userId')
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartsService.findOne(userId);
  }

  @Patch('items/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartsService.update(id, updateCartItemDto);
  }

  @Delete('items/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartsService.remove(id);
  }
}

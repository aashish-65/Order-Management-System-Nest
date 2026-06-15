import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    let newProduct = this.productRepository.create(createProductDto);

    newProduct = await this.productRepository.save(newProduct);
    return { message: 'Product created successfully.', data: newProduct };
  }

  async findAll() {
    const products = await this.productRepository.find();
    return { message: 'All Product fetched successfully.', data: products };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      return { success: false, message: 'No Product Found.' };
    }
    return {
      success: true,
      message: 'Product fetched successfully.',
      data: product,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const isValidProductId = await this.findOne(id);
    if (!isValidProductId.success) {
      return { message: 'Not a valid Product ID.' };
    }

    await this.productRepository.update(id, updateProductDto);
    return { message: 'Product updated successfully.' };
  }

  async remove(id: number) {
    const isValidProductId = await this.findOne(id);
    if (!isValidProductId.success) {
      return { message: 'Not a valid Product ID.' };
    }
    await this.productRepository.delete(id);
    return { message: 'Product Deleted successfully.' };
  }
}

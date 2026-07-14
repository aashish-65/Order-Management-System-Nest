import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    const { userId, productId } = createWishlistDto;

    const exsistingEntry = await this.wishlistRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      withDeleted: true,
    });

    if (exsistingEntry) {
      if (!exsistingEntry.deletedAt) {
        return { message: 'This product is already wishlisted.' };
      }
      await this.wishlistRepository.restore(exsistingEntry.id);

      return { message: 'Wishlist added successfully.' };
    }

    const newWishlist = this.wishlistRepository.create({
      user: { id: userId },
      product: { id: productId },
    });
    return await this.wishlistRepository.save(newWishlist);
  }

  findAll() {
    return `This action returns all wishlists`;
  }

  async findOne(id: number) {
    //this should not show the deleted wishlists
    const wishlist = await this.wishlistRepository.findOneBy({ id });
    if (!wishlist) {
      return { message: 'No wishlist found.' };
    }
    return wishlist;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  async remove(id: number) {
    //check if wishlist exists
    const wishlist = await this.wishlistRepository.findOneBy({ id });
    if (!wishlist) {
      return { message: 'No wishlist found.' };
    }
    await this.wishlistRepository.softDelete(id);
    return { message: 'Wishlist Removed successfully.' };
  }
}

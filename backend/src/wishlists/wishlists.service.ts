import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsRepository } from './wishlists.repository';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private repository: WishlistsRepository,
    private wishService: WishesService,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const { name, image, description, itemsId } = createWishlistDto;
    const wishes: Wish[] = await this.wishService.findByIds(itemsId);
    return this.repository.save({
      image,
      name,
      description,
      owner: user,
      items: wishes,
    });
  }

  findAll(): Promise<Wishlist[]> {
    return this.repository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  findOne(id: number): Promise<Wishlist> {
    return this.repository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async update(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.findWithOwnerCheck(user, id);
    const { name, image, description, itemsId } = updateWishlistDto;
    const wishes: Wish[] = await this.wishService.findByIds(itemsId);
    wishlist.name = name;
    wishlist.image = image;
    wishlist.description = description;
    wishlist.items = wishes;
    return this.repository.save(wishlist);
  }

  async remove(user: User, id: number) {
    const wishlist = await this.findWithOwnerCheck(user, id);
    this.repository.delete(id);
    return wishlist;
  }

  private async findWithOwnerCheck(user: User, id: number): Promise<Wishlist> {
    const wishlist: Wishlist = await this.repository.findOne({
      where: {
        owner: { id: user.id },
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundException(
        'Список для данного пользователя по ID не найден.',
      );
    }
    return wishlist;
  }
}

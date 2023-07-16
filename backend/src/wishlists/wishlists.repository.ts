import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsRepository extends Repository<Wishlist> {}

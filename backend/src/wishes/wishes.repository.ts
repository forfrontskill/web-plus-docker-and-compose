import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesRepository extends Repository<Wish> {}

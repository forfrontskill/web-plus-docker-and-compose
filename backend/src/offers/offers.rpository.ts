import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersRepository extends Repository<Offer> {}

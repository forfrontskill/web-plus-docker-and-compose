import {
  ForbiddenException,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { OffersRepository } from './offers.rpository';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { DataSource } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    private wishService: WishesService,
    @InjectRepository(Offer)
    private repository: OffersRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const { itemId, amount, hidden } = createOfferDto;
    const wish = await this.wishService.findOne(itemId);

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Вы не можете скидываться на собственный подарок',
      );
    }

    const resultRise = wish.raised + amount;
    if (resultRise > wish.price) {
      throw new MethodNotAllowedException('Сумма подарака превышена');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      wish.raised = wish.raised + amount;

      await queryRunner.manager.save(wish);

      const newOffer = new Offer();
      newOffer.user = user;
      newOffer.item = wish;
      newOffer.amount = amount;
      newOffer.hidden = hidden;

      const offer = await queryRunner.manager.save(newOffer);

      await queryRunner.commitTransaction();

      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  findAll(): Promise<Offer[]> {
    return this.repository.find({
      relations: {
        item: {
          owner: true,
          offers: true,
        },
        user: {
          wishes: {
            owner: true,
            offers: true,
          },
        },
      },
    });
  }

  findOne(id: number): Promise<Offer> {
    return this.repository.findOne({
      where: { id },
      relations: {
        item: {
          owner: true,
          offers: true,
        },
        user: {
          wishes: {
            owner: true,
            offers: true,
          },
        },
      },
    });
  }
}

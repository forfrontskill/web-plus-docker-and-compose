import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishesRepository } from './wishes.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { In } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private repository: WishesRepository,
  ) {}

  create(user: User, createWishDto: CreateWishDto): Promise<Wish> {
    return this.repository.save({
      ...createWishDto,
      owner: user,
    });
  }

  async findByUser(user: User): Promise<Wish[]> {
    const wishes = await this.repository.find({
      where: {
        owner: { id: user.id },
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
    return wishes;
  }

  findLast() {
    return this.repository.find({
      take: 40,
      order: { createdAt: 'ASC' },
      relations: {
        owner: true,
      },
    });
  }

  findTop() {
    return this.repository.find({
      take: 20,
      order: { copied: 'ASC' },
      relations: {
        owner: true,
      },
    });
  }

  findByIds(ids: number[]): Promise<Wish[]> {
    return this.repository.find({
      where: {
        id: In(ids),
      },
    });
  }

  findOne(id: number): Promise<Wish> {
    return this.repository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  save(wish: Wish): Promise<Wish> {
    return this.repository.save(wish);
  }

  async update(user: User, id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.repository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException(
        'Нельзя редактировать подарок, который вам не принадлежит.',
      );
    }

    if (wish.offers.length !== 0) {
      throw new ForbiddenException(
        'Нельзя редактировать подарок если уже есть донаты.',
      );
    }

    return this.repository.save({ ...wish, ...updateWishDto });
  }

  async remove(user: User, id: number): Promise<Wish> {
    const wish = await this.repository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });

    if (user.id !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете удалить чужие подарки.');
    }

    this.repository.delete(id);
    return wish;
  }

  async copy(user: User, id: number) {
    const wish = await this.repository.findOneBy({ id });

    const existWish = await this.repository.findOne({
      where: {
        owner: {
          id: user.id,
        },
        link: wish.link,
      },
      relations: {
        owner: true,
      },
    });

    if (existWish) {
      throw new ConflictException(
        'У вас уже есть подарок с аналогичной ссылкой',
      );
    }

    const newWish = { ...wish, owner: user, id: null };

    const copyWish = await this.repository.create(newWish);
    this.repository.save(copyWish);
  }
}

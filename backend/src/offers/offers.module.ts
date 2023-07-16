import { Module, forwardRef } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OffersRepository } from './offers.rpository';
import { Offer } from './entities/offer.entity';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    forwardRef(() => AuthModule),
    forwardRef(() => WishesModule),
  ],
  controllers: [OffersController],
  providers: [OffersService, OffersRepository],
})
export class OffersModule {}

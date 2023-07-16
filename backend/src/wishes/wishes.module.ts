import { Module, forwardRef } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './entities/wish.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesRepository } from './wishes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), forwardRef(() => AuthModule)],
  controllers: [WishesController],
  providers: [WishesService, WishesRepository],
  exports: [WishesService, WishesRepository],
})
export class WishesModule {}

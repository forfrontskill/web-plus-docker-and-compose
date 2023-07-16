import { IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @Length(1, 1500)
  description: string;

  itemsId: number[];
}

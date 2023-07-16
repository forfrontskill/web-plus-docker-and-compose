import { IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 250,
  })
  name: string;

  @IsUrl()
  @Column({
    type: 'varchar',
    length: 2048,
  })
  link: string;

  @IsUrl()
  @Column({
    type: 'varchar',
    length: 2048,
  })
  image: string;

  @Column({
    type: 'real',
    default: 0,
  })
  price: number;

  @Column({
    type: 'real',
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  owner: User;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    default: 0,
  })
  copied: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}

import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { FindOneOptions, ILike } from 'typeorm';
import { hashValue } from 'src/helpers/hash';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class UsersService {
  constructor(
    private wishService: WishesService,
    @InjectRepository(User)
    private repository: UsersRepository,
  ) {}

  findAll(): Promise<User[]> {
    return this.repository.find();
  }

  findOne(options: FindOneOptions<User>): Promise<User> {
    return this.repository.findOneOrFail(options);
  }

  findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  findByName(username: string) {
    return this.repository.findOneBy({ username });
  }

  async findWishesByUserName(username: string) {
    const user = await this.repository.findOneBy({ username });
    return this.findWishes(user);
  }

  findWishes(user: User) {
    return this.wishService.findByUser(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.repository.findOne({
      where: { id },
    });

    const isUserExist = await this.checkIfExist(
      updateUserDto.username,
      updateUserDto.email,
    );

    if (isUserExist) {
      throw new ConflictException('Данное имя пользователя или почта заняты.');
    }

    const newUser = { ...user, ...updateUserDto };

    if (updateUserDto.password) {
      newUser.password = await hashValue(updateUserDto.password);
    }

    await this.repository.save(newUser);

    return this.findById(id);
  }

  async checkIfExist(username: string, email: string): Promise<boolean> {
    const user = await this.repository.find({
      where: [
        { username: ILike(`%${username}%`) },
        { email: ILike(`%${email}%`) },
      ],
    });

    return !!user;
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;

    const isUserExist = await this.checkIfExist(
      createUserDto.username,
      createUserDto.email,
    );

    // if (isUserExist) {
    //   throw new ConflictException('Данное имя пользователя или почта заняты.');
    // }

    const user = await this.repository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.repository.save(user);
  }

  findMany(query: string): Promise<User[]> {
    return this.repository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
  }
}

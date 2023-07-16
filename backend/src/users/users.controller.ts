import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(UsersService.name);

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@AuthUser() user: User): Promise<UserDto> {
    const userId = user.id;
    this.logger.debug(
      `Получен запрос на предоставление информации о пользователе по ID ${userId}`,
    );
    const userDto = await this.usersService.findById(userId);

    this.logger.debug(
      `Запрос на предоставление информации о пользователе по ID ${userId} успешно выполнен`,
    );
    return userDto;
  }

  @Get(':username')
  findByUserName(@Param('username') username: string): Promise<UserDto> {
    return this.usersService.findByName(username);
  }

  @Get('me/wishes')
  @UseGuards(JwtAuthGuard)
  findWishes(@AuthUser() user: User): Promise<Wish[]> {
    return this.usersService.findWishes(user);
  }

  @Get(':username/wishes')
  @UseGuards(JwtAuthGuard)
  findWishesByUserName(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.findWishesByUserName(username);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  update(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const userId = user.id;
    this.logger.debug(
      `Получен запрос на обновление информации о пользователе по ID ${userId}.`,
    );

    const userDto = this.usersService.update(userId, updateUserDto);

    this.logger.debug(
      `Запрос на обновление информации о пользователе по ID ${userId} успешно выполнен.`,
    );

    return userDto;
  }

  @Post('find')
  @UseGuards(JwtAuthGuard)
  findMany(@Body() searchUser: SearchUserDto): Promise<User[]> {
    return this.usersService.findMany(searchUser.query);
  }
}

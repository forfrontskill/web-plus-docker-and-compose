export class UserDto {
  id: number;
  username: string;
  about?: string;
  avatar: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

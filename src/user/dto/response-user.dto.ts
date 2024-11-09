import { Exclude, Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  id?: string;
  @Expose()
  login: string;
  @Exclude()
  password: string;
  @Expose()
  version: number;
  @Expose()
  createdAt: number;
  @Expose()
  updatedAt: number;
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { User } from './interfaces/user.interface';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { v4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private db: InMemoryDatabaseService<User>) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user: User = {
      ...createUserDto,
      id: v4(),
      password: await bcrypt.hash(createUserDto.password, 10), // Hashing password
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return this.db.create(user);
  }

  findAll(): ResponseUserDto[] {
    return this.db.findAll();
  }

  findOne(id: string): ResponseUserDto {
    const user = this.db.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return this.db.findAll().find((user) => user.login === login);
  }

  async update(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<ResponseUserDto> {
    const user = this.db.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isPasswordMatching = await bcrypt.compare(
      updateUserPasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error:
            'The old password you provided is not matched with the user password',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedUser: User = this.db.update(id, {
      ...user,
      password: await bcrypt.hash(updateUserPasswordDto.newPassword, 10), // Hashing new password
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    return updatedUser;
  }

  remove(id: string): boolean {
    const isUserDeleted = this.db.remove(id);
    if (!isUserDeleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return isUserDeleted;
  }
}

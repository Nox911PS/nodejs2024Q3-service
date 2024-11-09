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

@Injectable()
export class UserService {
  constructor(private db: InMemoryDatabaseService<User>) {}

  create(createUserDto: CreateUserDto): ResponseUserDto {
    const user: User = {
      ...createUserDto,
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

  update(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): ResponseUserDto {
    const user = this.db.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.password !== updateUserPasswordDto.oldPassword) {
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
      password: updateUserPasswordDto.newPassword,
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

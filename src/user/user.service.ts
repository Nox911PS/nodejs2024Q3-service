import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from '../helpers/postgres.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user: User = this.userRepository.create({
      ...createUserDto,
      id: v4(),
      version: 1,
    });

    return this.userRepository.save(user).catch((error) => {
      if (error.code === PostgresErrorCode.UNIQUE_VIOLATION) {
        throw new HttpException(
          'User login must be unique',
          HttpStatus.CONFLICT,
        );
      } else {
        throw error;
      }
    });
  }

  findAll(): Promise<ResponseUserDto[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });

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

    const updatedUser: User = this.userRepository.create({
      ...user,
      password: updateUserPasswordDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    return this.userRepository.save(updatedUser);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return true;
  }
}

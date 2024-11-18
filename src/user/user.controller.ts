import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  PipeTransform,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { BadRequestExceptionFilter } from '../filters/bad-request-exception.filter';
import { NotFoundExceptionFilter } from '../filters/not-found-exception.filter';
import { UUIDValidationPipe } from '../validators/uuid-validation.pipe';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { RequestParamValidationPipe } from '../validators/request-param-validation.pipe';

@UseFilters(BadRequestExceptionFilter, NotFoundExceptionFilter)
@UseInterceptors(new TransformInterceptor(ResponseUserDto))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ResponseUserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', UUIDValidationPipe)
    id: string,
  ): Promise<ResponseUserDto | undefined> {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(RequestParamValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body(RequestParamValidationPipe)
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<ResponseUserDto | undefined> {
    return this.userService.update(id, updateUserPasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', UUIDValidationPipe) id: string): Promise<boolean> {
    return this.userService.remove(id);
  }
}

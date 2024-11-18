import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  PipeTransform,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ResponseAlbumDto } from './dto/response-album.dto';
import { BadRequestExceptionFilter } from '../filters/bad-request-exception.filter';
import { NotFoundExceptionFilter } from '../filters/not-found-exception.filter';
import { UUIDValidationPipe } from '../validators/uuid-validation.pipe';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { RequestParamValidationPipe } from '../validators/request-param-validation.pipe';

@UseFilters(BadRequestExceptionFilter, NotFoundExceptionFilter)
@UseInterceptors(new TransformInterceptor(ResponseAlbumDto))
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  findAll(): Promise<ResponseAlbumDto[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', UUIDValidationPipe)
    id: string,
  ): Promise<ResponseAlbumDto | undefined> {
    const album = await this.albumService.findOne(id);

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(RequestParamValidationPipe) createAlbumDto: CreateAlbumDto,
  ): Promise<ResponseAlbumDto> {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body(RequestParamValidationPipe)
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<ResponseAlbumDto | undefined> {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', UUIDValidationPipe) id: string): Promise<boolean> {
    return this.albumService.remove(id);
  }
}

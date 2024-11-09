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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ResponseArtistDto } from './dto/response-artist.dto';
import { BadRequestExceptionFilter } from '../filters/bad-request-exception.filter';
import { NotFoundExceptionFilter } from '../filters/not-found-exception.filter';
import { UUIDValidationPipe } from '../validators/uuid-validation.pipe';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { RequestParamValidationPipe } from '../validators/request-param-validation.pipe';

@UseFilters(BadRequestExceptionFilter, NotFoundExceptionFilter)
@UseInterceptors(new TransformInterceptor(ResponseArtistDto))
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  findAll(): ResponseArtistDto[] {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', UUIDValidationPipe)
    id: string,
  ): ResponseArtistDto | undefined {
    return this.artistService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(RequestParamValidationPipe) createArtistDto: CreateArtistDto,
  ): ResponseArtistDto {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body(RequestParamValidationPipe)
    updateArtistDto: UpdateArtistDto,
  ): ResponseArtistDto | undefined {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', UUIDValidationPipe) id: string): boolean {
    return this.artistService.remove(id);
  }
}

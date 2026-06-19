import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog-.dto';
import { UpdateSlugDto } from './dto/update-slug.dto';
import { deepEqual } from 'assert';
import { ParamsTokenFactory } from '@nestjs/core/pipes';

@Controller('admin/blogs')
@UseGuards(JwtAuthGuard)
export class AdminBlogController {
  constructor(private readonly blogService: BlogService) {}

  //find all
  @Get()
  findAll() {
    return this.blogService.findAllForAdmin();
  }

  //find one
  @Get()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOneForAdmin(id);
  }

  //Create
  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  //Update
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(id, dto);
  }

  //Update slug
  @Patch(':id/slug')
  updateSlug(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSlugDto,
  ) {
    return this.blogService.updateSlug(id, dto.slug);
  }

  //publish
  @Patch(':id/publish')
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.published(id);
  }

  //unpublish
  @Patch(':id/unpublish')
  unpublish(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.unpublished(id);
  }

  //remove
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}

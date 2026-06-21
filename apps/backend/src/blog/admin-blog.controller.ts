import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog-.dto';
import { UpdateSlugDto } from './dto/update-slug.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Blogs (Admin)')
@ApiBearerAuth('access-token')
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
  @Get(':id')
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

  // Images Section
  // update cover images
  @Post(':id/cover-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Invalid file type. Only JPEG, PNG, WebP allowed`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  updateCoverImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.updateCoverImage(id, file);
  }

  // add additional image
  @Post(':id/images')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Invalid file type. Only JPEG, PNG, WebP allowed`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  addAdditionalImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.addAdditionalImage(id, file);
  }

  //remove image
  @Delete(':id/images/:imageId')
  removeAdditionalImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.blogService.removeAdditionalImage(id, imageId);
  }
}

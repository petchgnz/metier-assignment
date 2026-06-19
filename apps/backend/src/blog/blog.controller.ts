import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { QueryBlogDto } from './dto/query-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  //find all with query
  @Get()
  findAll(@Query() query: QueryBlogDto) {
    return this.blogService.findPublished(query);
  }

  //find one with slug (when clicks on blog)
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findPublishedBySlug(slug);
  }
}

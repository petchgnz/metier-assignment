import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments (Public)')
@Controller('blogs/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('slug') slug: string, @Body() dto: CreateCommentDto) {
    const comment = await this.commentService.createForBlog(slug, dto);

    return {
      message: 'Your comment has been submitted and is awaiting approval.',
      comment: {
        id: comment.id,
        authorName: comment.authorName,
        status: comment.status,
      },
    };
  }
}

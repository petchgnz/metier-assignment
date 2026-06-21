import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CommentStatus } from '@prisma/client';

@ApiTags('Comments (Admin)')
@ApiBearerAuth('access-token')
@Controller('admin/comments')
@UseGuards(JwtAuthGuard)
export class AdminCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAll(@Query('status') status?: CommentStatus) {
    return this.commentService.findAllForAdmin(status);
  }

  @Patch(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.reject(id);
  }
}

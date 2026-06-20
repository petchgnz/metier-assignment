import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AdminCommentController } from './admin-comment.controller';

@Module({
  providers: [CommentService],
  controllers: [CommentController, AdminCommentController],
})
export class CommentModule {}

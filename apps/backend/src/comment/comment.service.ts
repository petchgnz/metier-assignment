import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentStatus } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  // for Users
  async createForBlog(slug: string, dto: CreateCommentDto) {
    const blog = await this.prisma.blog.findUnique({ where: { slug } });

    if (!blog || blog.status !== 'PUBLISHED')
      throw new NotFoundException(`Blog not found`);

    return this.prisma.comment.create({
      data: {
        authorName: dto.authorName,
        content: dto.content,
        status: CommentStatus.PENDING,
        blogId: blog.id,
      },
    });
  }

  // for Admin
  async findAllForAdmin(status?: CommentStatus) {
    return this.prisma.comment.findMany({
      where: status ? { status } : undefined,
      include: {
        blog: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(id: number) {
    await this.findOneOrThrow(id);

    return this.prisma.comment.update({
      where: { id },
      data: { status: CommentStatus.APPROVED },
    });
  }

  async reject(id: number) {
    await this.findOneOrThrow(id);

    return this.prisma.comment.update({
      where: { id },
      data: { status: CommentStatus.REJECTED },
    });
  }

  // admin helpers
  private async findOneOrThrow(id: number) {
    const existing = await this.prisma.comment.findUnique({ where: { id } });

    if (!existing)
      throw new NotFoundException(`Comment with id ${id} not found`);

    return existing;
  }
}

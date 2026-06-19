/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryBlogDto } from './dto/query-blog.dto';
import { BlogStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { slugify } from './utils/slugify';
import { UpdateSlugDto } from './dto/update-slug.dto';
import { UpdateBlogDto } from './dto/update-blog-.dto';

const PAGE_SIZE = 10;

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  // public services (no auth)
  async findPublished(query: QueryBlogDto) {
    const page = query.page ?? 1;

    // Prisma 'where' configs
    const where: Prisma.BlogWhereInput = {
      status: BlogStatus.PUBLISHED,
      ...(query.search && {
        title: { contains: query.search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImageUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      this.prisma.blog.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    };
  }

  async findPublishedBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { createdAt: 'asc' } },
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!blog || blog.status !== BlogStatus.PUBLISHED) {
      throw new NotFoundException('Blog not found');
    }

    //increment viewCount
    await this.prisma.blog.update({
      where: { id: blog.id },
      data: { viewCount: { increment: 1 } },
    });

    return { ...blog, viewCount: blog.viewCount + 1 };
  }

  // admin services
  async findAllForAdmin() {
    await this.prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { comments: true, images: true } } },
    });
  }

  async findOneForAdmin(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!blog) throw new NotFoundException(`Blog with id ${id} not found`);

    return blog;
  }

  async create(dto: CreateBlogDto) {
    const baseSlug = dto.slug ? slugify(dto.slug) : slugify(dto.title);
    const uniqueSlug = await this.generateUniqueSlug(baseSlug);

    return this.prisma.blog.create({
      data: {
        title: dto.title,
        slug: uniqueSlug,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImageUrl: dto.coverImageUrl,
        status: BlogStatus.UNPUBLISHED,
      },
    });
  }

  async update(id: number, dto: UpdateBlogDto) {
    await this.findOneForAdmin(id); // throw if not found

    return this.prisma.blog.update({
      where: { id },
      data: dto,
    });
  }

  async updateSlug(id: number, newSlug: string) {
    await this.findOneForAdmin(id); // throw if not found

    const normalizedSlug = slugify(newSlug);

    const existing = await this.prisma.blog.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existing && existing.id !== id) {
      throw new ConflictException(`Slug "${normalizedSlug}" is already in use`);
    }

    return this.prisma.blog.update({
      where: { id },
      data: { slug: normalizedSlug },
    });
  }

  async published(id: number) {
    await this.findOneForAdmin(id);

    return this.prisma.blog.update({
      where: { id },
      data: { status: BlogStatus.PUBLISHED },
    });
  }

  async unpublished(id: number) {
    await this.findOneForAdmin(id);

    return this.prisma.blog.update({
      where: { id },
      data: { status: BlogStatus.UNPUBLISHED },
    });
  }

  async remove(id: number) {
    await this.findOneForAdmin(id);
    await this.prisma.blog.delete({ where: { id } });
    return { message: 'Blog deleted successfully' };
  }

  // helpers
  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 2;

    while (await this.prisma.blog.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  BadRequestException,
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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

const PAGE_SIZE = 10;
const MAX_ADDITIONAL_IMAGES = 6;

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

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
    const blog = await this.findOneForAdmin(id);

    // collect all image urls
    const allImageUrls = [
      blog.coverImageUrl,
      ...blog.images.map((img) => img.imageUrl),
    ];

    // remove from cloudinary
    await Promise.allSettled(
      allImageUrls.filter(Boolean).map((url) => {
        const publicId = this.cloudinary.extractPublicId(url);
        return this.cloudinary.deleteImage(publicId);
      }),
    );

    // this one will automatically delete blogImage data (cascade del)
    await this.prisma.blog.delete({ where: { id } });

    return { message: 'Blog deleted successfully' };
  }

  // cover images
  async updateCoverImage(blogId: number, file: Express.Multer.File) {
    const blog = await this.findOneForAdmin(blogId);

    const uploadResult = await this.cloudinary.uploadImage(file, 'covers');

    // if a blog already have a coverImage, delete the old one
    if (blog.coverImageUrl) {
      const oldPublicId = this.cloudinary.extractPublicId(blog.coverImageUrl);
      await this.cloudinary.deleteImage(oldPublicId).catch(() => {}); //leave it blank cuz we don't want the whole function to break here
    }

    return await this.prisma.blog.update({
      where: { id: blogId },
      data: { coverImageUrl: uploadResult.secure_url },
    });
  }

  // additional images
  async addAdditionalImage(blogId: number, file: Express.Multer.File) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
      include: { _count: { select: { images: true } } },
    });

    if (!blog) throw new NotFoundException(`Blog with id ${blogId} not found`);
    if (blog._count.images >= MAX_ADDITIONAL_IMAGES)
      throw new BadRequestException(
        `Maximum ${MAX_ADDITIONAL_IMAGES} additional images allowed per blog`,
      );

    const uploadResult = await this.cloudinary.uploadImage(file, 'additional');
    return await this.prisma.blogImage.create({
      data: {
        blogId,
        imageUrl: uploadResult.secure_url,
      },
    });
  }

  async removeAdditionalImage(blogId: number, imageId: number) {
    const image = await this.prisma.blogImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.blogId !== blogId) {
      throw new NotFoundException(`Image not found for this blog`);
    }

    //remove from cloudinary with publicId
    const publicId = this.cloudinary.extractPublicId(image.imageUrl);
    await this.cloudinary.deleteImage(publicId).catch(() => {});

    await this.prisma.blogImage.delete({ where: { id: imageId } });
    return { message: `Image removed successfully` };
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

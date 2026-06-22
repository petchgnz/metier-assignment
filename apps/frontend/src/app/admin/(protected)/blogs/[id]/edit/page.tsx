'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAdminBlog } from '@/hooks/use-admin-blogs';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogContentForm } from '@/components/features/admin/blog-content-form';
import { SlugEditor } from '@/components/features/admin/slug-editor ';
import { CoverImageManager } from '@/components/features/admin/cover-image.manager';
import { AdditionalImagesManager } from '@/components/features/admin/additional-images-manager';

export default function EditBlogPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: blog, isLoading } = useAdminBlog(id);

  return (
    <div className='max-w-2xl'>
      <Link
        href='/admin/blogs'
        className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
      >
        <ArrowLeft className='h-4 w-4' />
        กลับไปรายการบทความ
      </Link>

      <h1 className='text-2xl font-bold mb-6'>แก้ไขบทความ</h1>

      {isLoading ?
        <div className='space-y-4'>
          <Skeleton className='h-8 w-1/2' />
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-40 w-full' />
        </div>
      : !blog ?
        <p className='text-muted-foreground'>ไม่พบบทความนี้</p>
      : <div className='space-y-8'>
          <BlogContentForm
            blogId={id}
            blog={blog}
          />
          <SlugEditor
            blogId={id}
            currentSlug={blog.slug}
          />
          <CoverImageManager
            blogId={id}
            currentCoverUrl={blog.coverImageUrl}
          />
          <AdditionalImagesManager
            blogId={id}
            images={blog.images}
          />
        </div>
      }
    </div>
  );
}

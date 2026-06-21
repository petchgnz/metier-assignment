'use client';

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

  if (isLoading) {
    return (
      <div className='space-y-4 max-w-2xl'>
        <Skeleton className='h-8 w-1/2' />
        <Skeleton className='h-40 w-full' />
        <Skeleton className='h-40 w-full' />
      </div>
    );
  }

  if (!blog) {
    return <p className='text-muted-foreground'>ไม่พบบทความนี้</p>;
  }

  return (
    <div className='max-w-2xl space-y-8'>
      <h1 className='text-2xl font-bold'>แก้ไขบทความ</h1>

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
  );
}

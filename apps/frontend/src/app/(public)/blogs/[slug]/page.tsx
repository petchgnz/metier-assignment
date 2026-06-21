import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { serverFetch } from '@/lib/api-server';
import { BlogDetail } from '@/types/blog';
import { BlogImageGallery } from '@/components/features/blog/blog-image-gallery';
import { CommentSection } from '@/components/features/blog/comment-section';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string): Promise<BlogDetail | null> {
  try {
    return await serverFetch<BlogDetail>(`/blogs/${slug}`);
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return null;
    }
    throw error;
  }
}

const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className='container mx-auto max-w-3xl px-4 py-10'>
      <div className='relative aspect-video rounded-lg overflow-hidden mb-6'>
        <Image
          src={blog.coverImageUrl}
          alt={blog.title}
          fill
          priority
          className='object-cover'
        />
      </div>

      <h1 className='text-3xl font-bold'>{blog.title}</h1>

      <div className='flex items-center gap-4 text-sm text-muted-foreground mt-3'>
        <span>{dateFormatter.format(new Date(blog.createdAt))}</span>
        <span className='flex items-center gap-1'>
          <Eye className='h-4 w-4' />
          {blog.viewCount.toLocaleString()} ครั้ง
        </span>
      </div>

      {blog.images.length > 0 && (
        <div className='mt-8'>
          <BlogImageGallery images={blog.images} />
        </div>
      )}

      <div className='mt-8 whitespace-pre-wrap leading-relaxed text-base'>
        {blog.content}
      </div>

      <div className='mt-16 border-t pt-10'>
        <CommentSection
          blogSlug={blog.slug}
          initialComments={blog.comments}
        />
      </div>
    </article>
  );
}

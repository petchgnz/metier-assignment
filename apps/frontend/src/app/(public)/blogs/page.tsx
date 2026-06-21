import { serverFetch } from '@/lib/api-server';
import { BlogListResponse } from '@/types/blog';
import { BlogCard } from '@/components/features/blog/blog-card';
import { BlogSearchBar } from '@/components/features/blog/blog-search-bar';
import { BlogPaginationControls } from '@/components/features/blog/blog-pagination-controls';

interface BlogsPageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { search, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const query = new URLSearchParams();
  if (search) query.set('search', search);
  query.set('page', String(currentPage));

  const { data: blogs, meta } = await serverFetch<BlogListResponse>(
    `/blogs?${query.toString()}`,
  );

  return (
    <div className='container mx-auto max-w-5xl px-4 py-10'>
      <h1 className='text-3xl font-bold mb-6'>บทความทั้งหมด</h1>

      <BlogSearchBar defaultValue={search ?? ''} />

      {blogs.length === 0 ?
        <p className='text-muted-foreground mt-10 text-center'>
          {search ? `ไม่พบบทความที่ตรงกับ "${search}"` : 'ยังไม่มีบทความ'}
        </p>
      : <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
            />
          ))}
        </div>
      }


      <BlogPaginationControls
        currentPage={meta.page}
        totalPages={meta.totalPages}
      />
    </div>
  );
}

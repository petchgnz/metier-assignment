import { serverFetch } from '@/lib/api-server';
import { BlogListResponse } from '@/types/blog';
import { BlogCard } from '@/components/features/blog/blog-card';
import { BlogSearchBar } from '@/components/features/blog/blog-search-bar';
import { BlogPaginationControls } from '@/components/features/blog/blog-pagination-controls';
import { Suspense } from 'react';

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
      <h1 className='text-3xl font-bold font-heading mb-6'>รวมบทความน่าอ่าน</h1>
      <p className='my-6 leading-relaxed text-muted-foreground'>
        เรื่องราวมากมายเกี่ยวกับเทคโนโลยี และการพัฒนาเว็บไซต์
      </p>

      <BlogSearchBar defaultValue={search ?? ''} />



      {blogs.length === 0 ?
        <p className='text-muted-foreground mt-10 text-center'>
          {search ? `ไม่พบบทความที่ตรงกับ "${search}"` : 'ยังไม่มีบทความ'}
        </p>
      : <div>
          <p className='text-muted-foreground mt-10'>
            พบ {meta.total} บทความ
          </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
              />
            ))}
          </div>
        </div>
      }

      <Suspense fallback={null}>
        <BlogPaginationControls
          currentPage={meta.page}
          totalPages={meta.totalPages}
          search={search}
        />
      </Suspense>
    </div>
  );
}

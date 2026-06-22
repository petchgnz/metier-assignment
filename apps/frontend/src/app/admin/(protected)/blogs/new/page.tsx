import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateBlogForm } from '@/components/features/admin/create-blog-form';

export default function NewBlogPage() {
  return (
    <div className='max-w-2xl mx-auto'>
      <Link
        href='/admin/blogs'
        className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
      >
        <ArrowLeft className='h-4 w-4' />
        กลับไปรายการบทความ
      </Link>
      <h1 className='text-2xl font-bold mb-6'>สร้างบทความใหม่</h1>
      <CreateBlogForm />
    </div>
  );
}

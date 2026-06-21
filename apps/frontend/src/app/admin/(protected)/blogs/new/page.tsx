import { CreateBlogForm } from '@/components/features/admin/create-blog-form';

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">สร้างบทความใหม่</h1>
      <CreateBlogForm />
    </div>
  );
}
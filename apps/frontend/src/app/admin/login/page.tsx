import { LoginForm } from '@/components/features/admin/login-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center px-3'>
      <div className='w-full max-w-sm'>
        <Link
          href='/'
          className='mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='h-3 w-4' />
          Back to Homepage
        </Link>

        <div className='space-y-5 rounded-2xl border border-border bg-card p-8'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold font-heading'>
              เข้าสู่ระบบผู้ดูแล
            </h2>

            <p className='mt-2 text-sm text-muted-foreground'>
              กรุณาเข้าสู่ระบบเพื่อจัดการบทความและความคิดเห็น
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

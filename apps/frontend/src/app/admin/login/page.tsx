import { LoginForm } from '@/components/features/admin/login-form';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4'>
      <div className=''>
        <Link href={'/blogs'}>go back home</Link>
      </div>

      <div className='w-full max-w-sm space-y-6 rounded-2xl border border-border bg-card p-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>เข้าสู่ระบบผู้ดูแล</h1>
          <p className='text-muted-foreground text-sm mt-1'>
            สำหรับผู้ดูแลระบบเท่านั้น
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

import { LoginForm } from '@/components/features/admin/login-form';

export default function AdminLoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-sm space-y-6'>
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

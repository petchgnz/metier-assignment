import Link from 'next/link';
import { Dog, Lock } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='border-b'>
        <div className='container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between'>
          <Link
            href='/blogs'
            className='font-bold text-lg flex gap-2'
            >
            <Dog />

            Blog Blog
          </Link>

          <div className='flex items-center gap-3'>
            {/* <Link
              href='/admin/login'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <Lock className='h-3.5 w-3.5' />
              ผู้ดูแลระบบ
            </Link> */}

            <Button
              variant='outline'
              size='sm'
              asChild
            >
              <Link
                href='/admin/login'
                className='gap-1.5'
              >
                <Lock className='h-3.5 w-3.5' />
                ผู้ดูแลระบบ
              </Link>
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className='flex-1'>{children}</main>
    </div>
  );
}

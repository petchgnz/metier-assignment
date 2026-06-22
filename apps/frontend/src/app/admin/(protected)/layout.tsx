'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearAuthToken } from '@/lib/auth-token';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const navItems = [
  { href: '/admin/blogs', label: 'จัดการบทความ' },
  { href: '/admin/comments', label: 'จัดการความคิดเห็น' },
];

const DETAIL_PAGE_PATTERNS = [
  /^\/admin\/blogs\/new$/,
  /^\/admin\/blogs\/\d+\/edit$/,
];

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    clearAuthToken();
    router.push('/admin/login');
  }

  const activeTab =
    navItems.find((item) => pathname.startsWith(item.href))?.href ?? navItems[0].href;

  const isDetailPage = DETAIL_PAGE_PATTERNS.some((pattern) => pattern.test(pathname));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b h-14 flex items-center shrink-0">
        <div className="max-w-5xl mx-auto px-8 w-full flex items-center justify-between">
          <span className="font-bold text-base">แผงควบคุมผู้ดูแลระบบ</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blogs">
                <Home className="h-4 w-4 mr-1" />
                หน้าเว็บ
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      <div className="mt-8">
        <div className="max-w-5xl mx-auto px-8">
          <Tabs value={activeTab} onValueChange={(href) => router.push(href)}>
            <TabsList
              className={`${
                isDetailPage ? 'opacity-40 pointer-events-none select-none' : ''
              }`}
            >
              {navItems.map((item) => (
                <TabsTrigger
                  key={item.href}
                  value={item.href}
                  className='hover:cursor-pointer'
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearAuthToken } from '@/lib/auth-token';
import { ThemeToggle } from '@/components/layout/theme-toggle';

const navItems = [
  { href: '/admin/blogs', label: 'จัดการบทความ' },
  { href: '/admin/comments', label: 'จัดการความคิดเห็น' },
];

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    clearAuthToken();
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r flex flex-col">
        <div className="h-16 flex items-center px-4 font-bold border-b">Admin Panel</div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm ${
                pathname.startsWith(item.href) ? 'bg-secondary font-medium' : 'hover:bg-secondary/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t flex items-center justify-between">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            ออกจากระบบ
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
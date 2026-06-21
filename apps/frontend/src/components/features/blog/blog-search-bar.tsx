'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const BlogSearchBar = ({ defaultValue }: { defaultValue: string }) => {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) params.set('search', value);

      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [value, pathname, router]);

  return (
    <div className='relative max-w-md'>
      <Search 
        className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground'
      />
      <Input
        placeholder='ค้นหาจากชื่อบทความ...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='pl-9'
      />
    </div>
  );
};
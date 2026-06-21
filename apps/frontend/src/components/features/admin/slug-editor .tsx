'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateSlug } from '@/hooks/use-admin-blogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export function SlugEditor({
  blogId,
  currentSlug,
}: {
  blogId: number;
  currentSlug: string;
}) {
  const [slug, setSlug] = useState(currentSlug);
  const updateSlug = useUpdateSlug(blogId);

  function handleSave() {
    if (slug === currentSlug) return;
    updateSlug.mutate(slug, {
      onSuccess: () => toast.success('อัปเดต Slug แล้ว'),
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slug</CardTitle>
        <CardDescription>
          ส่วนหนึ่งของ URL — เปลี่ยนแล้วลิงก์เก่าจะใช้ไม่ได้ทันที (ระบบไม่มี
          redirect อัตโนมัติ)
        </CardDescription>
      </CardHeader>
      <CardContent className='flex gap-2'>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <Button
          onClick={handleSave}
          disabled={updateSlug.isPending || slug === currentSlug}
          variant='outline'
        >
          {updateSlug.isPending ? 'กำลังบันทึก...' : 'บันทึก Slug'}
        </Button>
      </CardContent>
    </Card>
  );
}

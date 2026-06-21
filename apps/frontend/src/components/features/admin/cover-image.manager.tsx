'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useUploadCoverImage } from '@/hooks/use-admin-blogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CoverImageManager({
  blogId,
  currentCoverUrl,
}: {
  blogId: number;
  currentCoverUrl: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const uploadCover = useUploadCoverImage(blogId);

  function handleUpload() {
    if (!file) return;
    uploadCover.mutate(file, {
      onSuccess: () => {
        toast.success('เปลี่ยนภาพปกแล้ว');
        setFile(null);
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ภาพปก (Cover Image)</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='relative aspect-video w-full max-w-sm rounded-lg overflow-hidden bg-muted'>
          <Image
            src={currentCoverUrl}
            alt=''
            fill
            className='object-cover'
          />
        </div>
        <div className='flex gap-2 items-center'>
          <Input
            type='file'
            accept='image/jpeg,image/png,image/webp'
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className='max-w-xs'
          />
          <Button
            onClick={handleUpload}
            disabled={!file || uploadCover.isPending}
            variant='outline'
          >
            {uploadCover.isPending ? 'กำลังอัปโหลด...' : 'เปลี่ยนภาพปก'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

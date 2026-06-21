'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAddAdditionalImage,
  useRemoveAdditionalImage,
} from '@/hooks/use-admin-blogs';
import { BlogImage } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MAX_ADDITIONAL_IMAGES = 6;

export function AdditionalImagesManager({
  blogId,
  images,
}: {
  blogId: number;
  images: BlogImage[];
}) {
  const [file, setFile] = useState<File | null>(null);
  const addImage = useAddAdditionalImage(blogId);
  const removeImage = useRemoveAdditionalImage(blogId);

  const isFull = images.length >= MAX_ADDITIONAL_IMAGES;

  function handleAdd() {
    if (!file) return;
    addImage.mutate(file, {
      onSuccess: () => {
        toast.success('เพิ่มรูปภาพแล้ว');
        setFile(null);
      },
      onError: (error) => toast.error(error.message),
    });
  }

  function handleRemove(imageId: number) {
    removeImage.mutate(imageId, {
      onSuccess: () => toast.success('ลบรูปภาพแล้ว'),
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          รูปภาพเพิ่มเติม ({images.length}/{MAX_ADDITIONAL_IMAGES})
        </CardTitle>
        <CardDescription>
          รูปที่แสดงเป็น slider ในหน้าบทความ สูงสุด {MAX_ADDITIONAL_IMAGES} รูป
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-3 gap-3'>
          {images.map((image) => (
            <div
              key={image.id}
              className='relative aspect-square rounded-lg overflow-hidden bg-muted group'
            >
              <Image
                src={image.imageUrl}
                alt=''
                fill
                className='object-cover'
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size='icon'
                    variant='destructive'
                    className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ลบรูปภาพนี้?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ไม่สามารถย้อนกลับได้
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRemove(image.id)}>
                      ลบ
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>

        {isFull ?
          <p className='text-sm text-muted-foreground'>
            ครบจำนวนสูงสุดแล้ว ลบรูปเดิมก่อนถึงจะเพิ่มใหม่ได้
          </p>
        : <div className='flex gap-2 items-center'>
            <Input
              type='file'
              accept='image/jpeg,image/png,image/webp'
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className='max-w-xs'
            />
            <Button
              onClick={handleAdd}
              disabled={!file || addImage.isPending}
              variant='outline'
            >
              {addImage.isPending ? 'กำลังอัปโหลด...' : 'เพิ่มรูปภาพ'}
            </Button>
          </div>
        }
      </CardContent>
    </Card>
  );
}

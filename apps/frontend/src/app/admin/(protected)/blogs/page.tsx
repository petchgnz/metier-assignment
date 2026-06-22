'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Plus, Eye, EyeOff, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminBlogs,
  useDeleteBlog,
  useTogglePublish,
} from '@/hooks/use-admin-blogs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export default function AdminBlogsPage() {
  const { data: blogs, isLoading } = useAdminBlogs();
  const deleteBlog = useDeleteBlog();
  const togglePublish = useTogglePublish();

  function handleDelete(id: number) {
    deleteBlog.mutate(id, {
      onSuccess: () => toast.success('ลบบทความแล้ว'),
      onError: (error) => toast.error(error.message),
    });
  }

  function handleTogglePublish(
    id: number,
    currentStatus: 'PUBLISHED' | 'UNPUBLISHED',
  ) {
    togglePublish.mutate(
      { id, publish: currentStatus === 'UNPUBLISHED' },
      {
        onSuccess: () => toast.success('อัปเดตสถานะแล้ว'),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <TooltipProvider>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-sm text-muted-foreground'>
          ทั้งหมด {blogs?.length ?? 0} บทความ
        </p>
        <Button
          asChild
          size='sm'
        >
          <Link href='/admin/blogs/new'>
            <Plus className='h-4 w-4 mr-1' />
            สร้างบทความใหม่
          </Link>
        </Button>
      </div>

      {isLoading ?
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-14 w-full'
            />
          ))}
        </div>
      : <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อบทความ</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className='text-center'>จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs?.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <div className='relative h-10 w-16 rounded overflow-hidden bg-muted shrink-0'>
                      <Image
                        src={blog.coverImageUrl}
                        alt=''
                        fill
                        className='object-cover'
                      />
                    </div>
                    <span className='font-medium line-clamp-1 max-w-xs'>
                      {blog.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='text-muted-foreground text-sm'>
                  /{blog.slug}
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {dateFormatter.format(new Date(blog.createdAt))}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      blog.status === 'PUBLISHED' ? 'default' : 'secondary'
                    }
                  >
                    {blog.status === 'PUBLISHED' ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    {/* Toggle publish */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() =>
                            handleTogglePublish(blog.id, blog.status)
                          }
                          disabled={togglePublish.isPending}
                        >
                          {blog.status === 'PUBLISHED' ?
                            <EyeOff className='h-4 w-4' />
                          : <Eye className='h-4 w-4' />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {blog.status === 'PUBLISHED' ?
                          'ยกเลิกเผยแพร่'
                        : 'เผยแพร่'}
                      </TooltipContent>
                    </Tooltip>

                    {/* Open public page */}
                    {blog.status === 'PUBLISHED' ?
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            asChild
                          >
                            <Link
                              href={`/blogs/${blog.slug}`}
                              target='_blank'
                            >
                              <ExternalLink className='h-4 w-4' />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>ดูหน้าบทความ</TooltipContent>
                      </Tooltip>
                    : <Tooltip>
                        <TooltipTrigger asChild>
                          {/* div แทน Button เพราะ disabled Button ใน TooltipTrigger มีปัญหาเรื่อง pointer events */}
                          <div className='h-9 w-9 flex items-center justify-center rounded-md opacity-30 cursor-not-allowed'>
                            <ExternalLink className='h-4 w-4' />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          เผยแพร่บทความก่อนจึงจะดูหน้าบทความได้
                        </TooltipContent>
                      </Tooltip>
                    }

                    {/* Edit */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          asChild
                        >
                          <Link href={`/admin/blogs/${blog.id}/edit`}>
                            <Pencil className='h-4 w-4' />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>แก้ไข</TooltipContent>
                    </Tooltip>

                    {/* Delete */}
                    <AlertDialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-destructive hover:text-destructive'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>ลบ</TooltipContent>
                      </Tooltip>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ยืนยันการลบบทความ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            การลบ &quot;{blog.title}&quot;
                            จะลบรูปภาพและคอมเมนต์ทั้งหมดที่เกี่ยวข้องด้วย
                            และไม่สามารถย้อนกลับได้
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(blog.id)}
                          >
                            ลบบทความ
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }

      {blogs?.length === 0 && (
        <p className='text-muted-foreground text-center py-10'>
          ยังไม่มีบทความ เริ่มสร้างบทความแรกของคุณ
        </p>
      )}
    </TooltipProvider>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  useAdminComments,
  useApproveComment,
  useRejectComment,
  CommentStatusFilter,
} from '@/hooks/use-admin-comments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const statusLabel: Record<string, string> = {
  PENDING: 'รออนุมัติ',
  APPROVED: 'อนุมัติแล้ว',
  REJECTED: 'ถูกปฏิเสธ',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
};

export default function AdminCommentsPage() {
  const [filter, setFilter] = useState<CommentStatusFilter>('PENDING');
  const { data: comments, isLoading } = useAdminComments(filter);
  const approveComment = useApproveComment();
  const rejectComment = useRejectComment();

  function handleApprove(id: number) {
    approveComment.mutate(id, {
      onSuccess: () => toast.success('อนุมัติความคิดเห็นแล้ว'),
      onError: (error) => toast.error(error.message),
    });
  }

  function handleReject(id: number) {
    rejectComment.mutate(id, {
      onSuccess: () => toast.success('ปฏิเสธความคิดเห็นแล้ว'),
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>จัดการความคิดเห็น</h1>

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as CommentStatusFilter)}
        className='mb-6'
      >
        <TabsList>
          <TabsTrigger value='PENDING'>รออนุมัติ</TabsTrigger>
          <TabsTrigger value='APPROVED'>อนุมัติแล้ว</TabsTrigger>
          <TabsTrigger value='REJECTED'>ถูกปฏิเสธ</TabsTrigger>
          <TabsTrigger value='ALL'>ทั้งหมด</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ?
        <div className='space-y-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-16 w-full'
            />
          ))}
        </div>
      : <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ผู้แสดงความคิดเห็น</TableHead>
              <TableHead>เนื้อหา</TableHead>
              <TableHead>บทความ</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead className='text-right'>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments?.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className='font-medium'>
                  {comment.authorName}
                </TableCell>
                <TableCell className='max-w-xs truncate'>
                  {comment.content}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/blogs/${comment.blog.slug}`}
                    target='_blank'
                    className='text-primary hover:underline text-sm'
                  >
                    {comment.blog.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[comment.status]}>
                    {statusLabel[comment.status]}
                  </Badge>
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {dateFormatter.format(new Date(comment.createdAt))}
                </TableCell>
                <TableCell className='text-right space-x-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    disabled={
                      comment.status === 'APPROVED' || approveComment.isPending
                    }
                    onClick={() => handleApprove(comment.id)}
                  >
                    อนุมัติ
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    disabled={
                      comment.status === 'REJECTED' || rejectComment.isPending
                    }
                    onClick={() => handleReject(comment.id)}
                  >
                    ปฏิเสธ
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }

      {comments?.length === 0 && (
        <p className='text-muted-foreground text-center py-10'>
          ไม่มีความคิดเห็นในหมวดนี้
        </p>
      )}
    </div>
  );
}

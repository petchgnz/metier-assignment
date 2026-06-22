'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
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

  // นับจำนวนแต่ละ status สำหรับแสดงใน tab label
  const counts = {
    PENDING: useAdminComments('PENDING').data?.length ?? 0,
    APPROVED: useAdminComments('APPROVED').data?.length ?? 0,
    REJECTED: useAdminComments('REJECTED').data?.length ?? 0,
  };

  return (
    <div>
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as CommentStatusFilter)}
        className='mb-6'
      >
        <TabsList>
          <TabsTrigger value='PENDING' className='hover:cursor-pointer'>
            รออนุมัติ {counts.PENDING > 0 && `(${counts.PENDING})`}
          </TabsTrigger>
          <TabsTrigger value='APPROVED' className='hover:cursor-pointer'>
            อนุมัติแล้ว {counts.APPROVED > 0 && `(${counts.APPROVED})`}
          </TabsTrigger>
          <TabsTrigger value='REJECTED' className='hover:cursor-pointer'>
            ปฏิเสธ {counts.REJECTED > 0 && `(${counts.REJECTED})`}
          </TabsTrigger>
          <TabsTrigger value='ALL' className='hover:cursor-pointer'>ทั้งหมด</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ?
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-24 w-full rounded-lg'
            />
          ))}
        </div>
      : <div className='space-y-3'>
          {comments?.map((comment) => (
            <div
              key={comment.id}
              className='border rounded-lg px-4 py-3 flex items-start justify-between gap-4'
            >
              {/* Left: content */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='font-medium text-sm'>
                    {comment.authorName}
                  </span>
                  <Badge
                    variant={statusVariant[comment.status]}
                    className='text-xs'
                  >
                    {statusLabel[comment.status]}
                  </Badge>
                </div>
                <p className='text-sm text-foreground'>{comment.content}</p>
                <p className='text-xs text-muted-foreground mt-1'>
                  บน{' '}
                  <Link
                    href={`/blogs/${comment.blog.slug}`}
                    target='_blank'
                    className='hover:underline'
                  >
                    &quot;{comment.blog.title}&quot;
                  </Link>
                  {' · '}
                  {dateFormatter.format(new Date(comment.createdAt))}
                </p>
              </div>

              {/* Right: actions */}
              <div className='flex items-center gap-2 shrink-0'>
                <Button
                  size='sm'
                  disabled={
                    comment.status === 'APPROVED' || approveComment.isPending
                  }
                  onClick={() => handleApprove(comment.id)}
                >
                  <Check className='h-3.5 w-3.5 mr-1' />
                  อนุมัติ
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={
                    comment.status === 'REJECTED' || rejectComment.isPending
                  }
                  onClick={() => handleReject(comment.id)}
                >
                  <X className='h-3.5 w-3.5 mr-1' />
                  ปฏิเสธ
                </Button>
              </div>
            </div>
          ))}
        </div>
      }

      {comments?.length === 0 && (
        <p className='text-muted-foreground text-center py-10'>
          ไม่มีความคิดเห็นในหมวดนี้
        </p>
      )}
    </div>
  );
}

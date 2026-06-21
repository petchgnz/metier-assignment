'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminBlogs, useDeleteBlog, useTogglePublish } from '@/hooks/use-admin-blogs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const dateFormatter = new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

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

  function handleTogglePublish(id: number, currentStatus: 'PUBLISHED' | 'UNPUBLISHED') {
    togglePublish.mutate(
      { id, publish: currentStatus === 'UNPUBLISHED' },
      {
        onSuccess: () => toast.success('อัปเดตสถานะแล้ว'),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">จัดการบทความ</h1>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="h-4 w-4 mr-2" />
            สร้างบทความใหม่
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ภาพปก</TableHead>
              <TableHead>ชื่อบทความ</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>คอมเมนต์</TableHead>
              <TableHead>วันที่สร้าง</TableHead>
              <TableHead className="text-right">การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs?.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <div className="relative h-12 w-20 rounded overflow-hidden bg-muted">
                    <Image src={blog.coverImageUrl} alt="" fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-xs truncate">{blog.title}</TableCell>
                <TableCell>
                  <Badge variant={blog.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {blog.status === 'PUBLISHED' ? 'เผยแพร่แล้ว' : 'ยังไม่เผยแพร่'}
                  </Badge>
                </TableCell>
                <TableCell>{blog._count.comments}</TableCell>
                <TableCell>{dateFormatter.format(new Date(blog.createdAt))}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleTogglePublish(blog.id, blog.status)}>
                    {blog.status === 'PUBLISHED' ? 'ยกเลิกเผยแพร่' : 'เผยแพร่'}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/blogs/${blog.id}/edit`}>แก้ไข</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">ลบ</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบบทความ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          การลบ &quot;{blog.title}&quot; จะลบรูปภาพและคอมเมนต์ทั้งหมดที่เกี่ยวข้องด้วย
                          และไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(blog.id)}>
                          ลบบทความ
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {blogs?.length === 0 && (
        <p className="text-muted-foreground text-center py-10">ยังไม่มีบทความ เริ่มสร้างบทความแรกของคุณ</p>
      )}
    </div>
  );
}
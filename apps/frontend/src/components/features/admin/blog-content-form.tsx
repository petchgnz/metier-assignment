'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useUpdateBlog } from '@/hooks/use-admin-blogs';
import { blogFormSchema } from '@/lib/validations/blog';
import { AdminBlogDetail } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const contentSchema = blogFormSchema.omit({ slug: true });
type ContentInput = z.infer<typeof contentSchema>;

export function BlogContentForm({
  blogId,
  blog,
}: {
  blogId: number;
  blog: AdminBlogDetail;
}) {
  const updateBlog = useUpdateBlog(blogId);

  const form = useForm<ContentInput>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
    },
  });

  function onSubmit(values: ContentInput) {
    updateBlog.mutate(values, {
      onSuccess: () => toast.success('บันทึกเนื้อหาแล้ว'),
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>เนื้อหาบทความ</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='title'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>ชื่อบทความ</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='excerpt'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>คำโปรย (Excerpt)</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={2}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='content'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>เนื้อหาเต็ม</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={12}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button
              type='submit'
              disabled={updateBlog.isPending}
              className='w-fit'
            >
              {updateBlog.isPending ? 'กำลังบันทึก...' : 'บันทึกเนื้อหา'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

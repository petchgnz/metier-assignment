'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateBlogWithCoverImage } from '@/hooks/use-admin-blogs';
import { blogFormSchema, BlogFormInput } from '@/lib/validations/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldLabel, FieldError, FieldDescription, FieldGroup } from '@/components/ui/field';

export function CreateBlogForm() {
  const router = useRouter();
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const createBlog = useCreateBlogWithCoverImage();

  const form = useForm<BlogFormInput>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: { title: '', slug: '', excerpt: '', content: '' },
  });

  function onSubmit(values: BlogFormInput) {
    if (!coverImageFile) {
      toast.error('กรุณาเลือกภาพปกก่อนบันทึก');
      return;
    }

    createBlog.mutate(
      { input: values, coverImageFile },
      {
        onSuccess: () => {
          toast.success('สร้างบทความสำเร็จ');
          router.push('/admin/blogs');
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl">
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>ชื่อบทความ</FieldLabel>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Slug (ไม่บังคับ)</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="เว้นว่างเพื่อให้ระบบสร้างจากชื่อบทความ"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>ใช้เป็นส่วนหนึ่งของ URL เช่น /blogs/your-slug</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="excerpt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>คำโปรย (Excerpt)</FieldLabel>
              <Textarea {...field} id={field.name} rows={2} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>เนื้อหาเต็ม</FieldLabel>
              <Textarea {...field} id={field.name} rows={12} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="cover-image">ภาพปก (Cover Image)</FieldLabel>
          <Input
            id="cover-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setCoverImageFile(e.target.files?.[0] ?? null)}
          />
          <FieldDescription>รองรับ JPEG, PNG, WebP ขนาดไม่เกิน 5MB</FieldDescription>
        </Field>

        <Button type="submit" disabled={createBlog.isPending}>
          {createBlog.isPending ? 'กำลังบันทึก...' : 'สร้างบทความ'}
        </Button>
      </FieldGroup>
    </form>
  );
}
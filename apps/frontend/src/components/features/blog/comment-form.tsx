'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/axios';
import { createCommentSchema, CreateCommentInput } from '@/lib/validations/comment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';

export function CommentForm({ blogSlug }: { blogSlug: string }) {
  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { authorName: '', content: '' },
  });

  const mutation = useMutation({
    mutationFn: (input: CreateCommentInput) =>
      apiClient.post(`/blogs/${blogSlug}/comments`, input),
    onSuccess: (response) => {
      toast.success(
        // response.data?.message ?? 'ความคิดเห็นของคุณถูกส่งแล้ว และกำลังรอการอนุมัติ',
        'ความคิดเห็นของคุณถูกส่งแล้ว และกำลังรอการอนุมัติ',
      );
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: CreateCommentInput) {
    mutation.mutate(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="authorName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>ชื่อผู้แสดงความคิดเห็น</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="ชื่อของคุณ"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                ความคิดเห็น (ภาษาไทยและตัวเลขเท่านั้น)
              </FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="แสดงความคิดเห็นของคุณ..."
                rows={4}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
        </Button>
      </FieldGroup>
    </form>
  );
}
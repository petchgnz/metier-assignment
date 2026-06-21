import AdminBlogsPage from '@/app/admin/(protected)/blogs/page';
import { BlogFormInput } from './../lib/validations/blog';
import { apiClient } from '@/lib/axios';
import { AdminBlogDetail, AdminBlogListItem, BlogImage } from '@/types/blog';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { NEXT_REWRITTEN_QUERY_HEADER } from 'next/dist/client/components/app-router-headers';
import { multipleOf } from 'zod';

export const ADMIN_BLOGS_KEY = ['admin', 'blogs'];

export function useAdminBlogs() {
  return useQuery({
    queryKey: ADMIN_BLOGS_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<AdminBlogListItem[]>('/admin/blogs');
      return data;
    },
  });
}

export function useCreateBlogWithCoverImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      input,
      coverImageFile,
    }: {
      input: BlogFormInput;
      coverImageFile: File;
    }) => {
      // create blog without coverImageUrl first
      const { data: blog } = await apiClient.post<AdminBlogDetail>(
        '/admin/blogs',
        {
          ...input,
          coverImageUrl: 'pending-upload',
        },
      );

      //then upload image to get cloudinary url and updated to the blog
      const formData = new FormData();
      formData.append('file', coverImageFile);
      const { data: updatedBlog } = await apiClient.post<AdminBlogDetail>(
        `/admin/blogs/${blog.id}/cover-image`,
        formData,

        // set content-type to undefined and let the browser decides
        { headers: { 'Content-Type': undefined } },
      );

      return updatedBlog;
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEY }),
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEY });
    },
  });
}

export function useTogglePublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, publish }: { id: number; publish: boolean }) => {
      const action = publish ? 'publish' : 'unpublish';
      const { data } = await apiClient.patch(`/admin/blogs/${id}/${action}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEY });
    },
  });
}

export function useAdminBlog(id: number) {
  return useQuery({
    queryKey: [...ADMIN_BLOGS_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get<AdminBlogDetail>(
        `/admin/blogs/${id}`,
      );
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateBlog(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Partial<BlogFormInput>) => {
      const { data } = await apiClient.patch<AdminBlogDetail>(
        `/admin/blogs/${id}`,
        input,
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEY });
    },
  });
}

export function useUpdateSlug(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: Partial<BlogFormInput>) => {
      const { data } = await apiClient.patch<AdminBlogDetail>(
        `/admin/blogs/${id}/slug`,
        { slug },
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEY });
    },
  });
}

export function useUploadCoverImage(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<AdminBlogDetail>(
        `/admin/blogs/${id}/cover-image`,
        formData,
        { headers: { 'Content-Type': undefined } },
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEY });
    },
  });
}

export function useAddAdditionalImage(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<BlogImage>(
        `/admin/blogs/${id}/images`,
        formData,
        { headers: { 'Content-Type': undefined } },
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEY });
    },
  });
}

export function useRemoveAdditionalImage(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: number) => {
      await apiClient.delete(`/admin/blogs/${id}/images/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOGS_KEY });
    },
  });
}

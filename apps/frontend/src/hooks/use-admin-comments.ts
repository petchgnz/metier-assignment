import { apiClient } from '@/lib/axios';
import { AdminComment } from '@/types/comment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ADMIN_COMMENTS_KEY = ['admin', 'comments'];
export type CommentStatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export function useAdminComments(status: CommentStatusFilter) {
  return useQuery({
    queryKey: [...ADMIN_COMMENTS_KEY, status],
    queryFn: async () => {
      const params = status === 'ALL' ? '' : `?status=${status}`;
      const { data } = await apiClient.get<AdminComment[]>(
        `/admin/comments${params}`,
      );
      return data;
    },
  });
}

export function useApproveComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.patch(`/admin/comments/${id}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY });
    },
  });
}

export function useRejectComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.patch(`/admin/comments/${id}/reject`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY });
    },
  });
}

import { CommentStatus } from './blog';

export interface AdminComment {
  id: number;
  authorName: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  blogId: number;
  blog: {
    id: number;
    title: string;
    slug: string;
  };
}

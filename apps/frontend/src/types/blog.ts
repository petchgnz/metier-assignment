export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type BlogStatus = 'PUBLISHED' | 'UNPUBLISHED';

export interface BlogListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  viewCount: number;
  createdAt: string;
}

export interface BlogListResponse {
  data: BlogListItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogImage {
  id: number;
  imageUrl: string;
  blogId: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  authorName: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  blogId: number;
}

export interface BlogDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  viewCount: number;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
  images: BlogImage[];
  comments: Comment[];
}

// Admin
export interface AdminBlogListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  viewCount: number;
  status: 'PUBLISHED' | 'UNPUBLISHED';
  createdAt: string;
  updatedAt: string;
  _count: { comments: number; images: number };
}

export interface AdminBlogDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  viewCount: number;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
  images: BlogImage[];
}

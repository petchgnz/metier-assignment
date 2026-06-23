import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BlogListItem } from '@/types/blog';
import { Eye } from 'lucide-react';

const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function BlogCard({ blog }: { blog: BlogListItem }) {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <div className="relative aspect-video">
          <Image src={blog.coverImageUrl} alt={blog.title} fill className="object-cover" />
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <h2 className="font-semibold text-lg line-clamp-2">{blog.title}</h2>
          <p className="text-muted-foreground text-sm mt-2 my-4 line-clamp-3">{blog.excerpt}</p>
          <div className="flex items-center justify-between mt-auto">
            <p className="text-xs text-muted-foreground">
              {dateFormatter.format(new Date(blog.createdAt))}
            </p>
            <span className="flex items-center gap-1 text-xs text-muted-foreground self-end">
              <Eye className="h-3 w-3" />
              {blog.viewCount.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BlogListItem } from '@/types/blog';

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
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg line-clamp-2">{blog.title}</h2>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3">{blog.excerpt}</p>
          <div>
            <p className="text-xs text-muted-foreground mt-3">
              {dateFormatter.format(new Date(blog.createdAt))}
            </p>

            <p className=''></p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
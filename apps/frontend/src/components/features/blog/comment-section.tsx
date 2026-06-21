import { Comment } from '@/types/blog';
import { CommentList } from './comment-list';
import { CommentForm } from './comment-form';

export function CommentSection({
  blogSlug,
  initialComments,
}: {
  blogSlug: string;
  initialComments: Comment[];
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">ความคิดเห็น ({initialComments.length})</h2>
      <CommentList comments={initialComments} />
      <div className="mt-10">
        <CommentForm blogSlug={blogSlug} />
      </div>
    </div>
  );
}
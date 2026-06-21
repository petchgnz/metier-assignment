import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Comment } from '@/types/blog';

const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็นสิ
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar>
            <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.authorName}</span>
              <span className="text-xs text-muted-foreground">
                {dateFormatter.format(new Date(comment.createdAt))}
              </span>
            </div>
            <p className="mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
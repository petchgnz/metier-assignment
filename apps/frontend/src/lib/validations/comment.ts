import { z } from 'zod';

const THAI_CONTENT_REGEX =
  /^(?=.*[\u0E01-\u0E2E\u0E30-\u0E3A\u0E40-\u0E4E\u0E50-\u0E590-9])[\u0E01-\u0E2E\u0E30-\u0E3A\u0E40-\u0E4E\u0E50-\u0E590-9\s]+$/;

export const createCommentSchema = z.object({
  authorName: z.string().min(1, 'กรุณากรอกชื่อผู้แสดงความคิดเห็น').max(100),
  content: z
    .string()
    .min(1, 'กรุณากรอกความคิดเห็น')
    .max(1000)
    .regex(THAI_CONTENT_REGEX, 'รองรับเฉพาะภาษาไทยและตัวเลขเท่านั้น'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>

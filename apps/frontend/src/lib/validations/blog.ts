import { z } from 'zod';

export const blogFormSchema = z.object({
  title: z.string().min(1, 'กรุณากรอกชื่อบทความ').max(255),
  slug: z.string().optional(),
  excerpt: z.string().min(1, 'กรุณากรอกคำอธิบายแบบสั้น').max(500),
  content: z.string().min(1, 'กรุณากรอกเนื้อหาบทความ'),
});

export type BlogFormInput = z.infer<typeof blogFormSchema>;
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export const THAI_CONTENT_REGEX =
  /^(?=.*[\u0E01-\u0E2E\u0E30-\u0E3A\u0E40-\u0E4E\u0E50-\u0E590-9])[\u0E01-\u0E2E\u0E30-\u0E3A\u0E40-\u0E4E\u0E50-\u0E590-9\s\/]+$/;

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Author name is required' })
  @MaxLength(100, { message: 'Author name must not exceed 100 characters' })
  authorName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Comment content is required' })
  @MaxLength(1000, { message: 'Comment must not exceed 1000 characters' })
  @Matches(THAI_CONTENT_REGEX, {
    message: 'Comment must contain only Thai characters and/or numbers',
  })
  content!: string;
}

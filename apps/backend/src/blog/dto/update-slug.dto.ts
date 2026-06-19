import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UpdateSlugDto {
  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9ก-๙-]+$/, {
    message:
      'Slug must contain only lowercase letters, numbers, Thai characters, and hyphens',
  })
  slug!: string;
}

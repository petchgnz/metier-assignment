import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsNotEmpty({ message: 'Excerpt is required' })
  @MaxLength(255)
  excerpt!: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content!: string;

  @IsUrl()
  @IsNotEmpty({ message: 'Cover image URL is required' })
  coverImageUrl!: string;
}

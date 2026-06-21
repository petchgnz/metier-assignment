import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255)
  title!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Excerpt is required' })
  @MaxLength(255)
  excerpt!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content!: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty({ message: 'Cover image URL is required' })
  coverImageUrl!: string;
}

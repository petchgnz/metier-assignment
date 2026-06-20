/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Inject,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { CLOUDINARY } from './cloudinary.provider';
import * as streamifier from 'streamifier';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; //5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof v2) {}

  //upload Image
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    this.validateFile(file);

    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: `blog-management/${folder}`,
          resource_type: 'image',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result?: UploadApiResponse,
        ) => {
          if (error || !result) {
            return reject(
              new BadRequestException(error?.message ?? 'Image upload failed'),
            );
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  //delete Image
  async deleteImage(publicId: string): Promise<void> {
    await this.cloudinary.uploader.destroy(publicId);
  }

  // helpers
  extractPublicId(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const fileWithExt = parts[parts.length - 1];
    const folderPath = parts
      .slice(parts.indexOf('blog-management'), -1)
      .join('/');
    const fileName = fileWithExt.split('.')[0];
    return `${folderPath}/${fileName}`;
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) throw new BadRequestException('No file provided');

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File too large. Maximum size: ${MAX_FILE_SIZE_BYTES}`,
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.interface';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class S3StorageService implements StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.bucketName =
      this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';

    if (!this.bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set');
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    try {
      console.log(file);
      const key = `room-layouts/${fileName}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file,
          ContentType: mimeType,
        }),
      );

      return this.getFileUrl(key);
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Failed to upload file to S3: ${error.message}`,
      });
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = this.getKeyFromUrl(fileUrl);

      if (!key) {
        throw new Error('Invalid S3 URL');
      }

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Failed to delete file from S3: ${error.message}`,
      });
    }
  }

  getFileUrl(fileName: string): string {
    return fileName;
  }

  private getKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      // Check if this is an S3 URL
      if (hostname.includes('s3') && hostname.includes(this.bucketName)) {
        // The path without the leading slash is the key
        return urlObj.pathname.substring(1);
      }

      return null;
    } catch (error) {
      return error;
    }
  }
}

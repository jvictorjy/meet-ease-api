import { Injectable, Inject } from '@nestjs/common';
import { StorageService } from '@app/@common/infrastructure/adapters/storage/storage.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject('StorageService')
    private readonly storageService: StorageService,
  ) {}

  /**
   * Uploads a file to the storage service
   * @param file The file to upload
   * @param directory Optional directory to store the file in (default: '')
   * @returns The URL of the uploaded file
   */
  async uploadFile(
    file: Express.Multer.File,
    directory?: string,
  ): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${directory ? `${directory}/` : ''}${uuid()}.${fileExtension}`;

    return this.storageService.uploadFile(file.buffer, fileName, file.mimetype);
  }

  /**
   * Deletes a file from the storage service
   * @param fileUrl The URL of the file to delete
   */
  async deleteFile(fileUrl: string): Promise<void> {
    await this.storageService.deleteFile(fileUrl);
  }
}

export interface StorageService {
  uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string>;

  deleteFile(fileUrl: string): Promise<void>;

  getFileUrl(fileName: string): string;
}

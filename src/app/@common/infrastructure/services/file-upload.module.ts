import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { StorageModule } from '@app/@common/infrastructure/adapters/storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}

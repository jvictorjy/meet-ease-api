import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@app/@common/infrastructure/adapters/database/prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}

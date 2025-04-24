import { Global, Module } from '@nestjs/common';

import { PrismaDatabaseAdapter } from './prisma/prisma-database.adapter';

@Global()
@Module({
  providers: [PrismaDatabaseAdapter],
  exports: [PrismaDatabaseAdapter],
})
export class DatabaseModule {}

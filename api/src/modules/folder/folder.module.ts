import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { Folder, FolderSchema } from './entities/folder.entity';
import { AuthModule } from '../auth/auth.module';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [
    AuthModule,
    TenantsModule,
    TenancyModule.forFeature([
      {
        name: Folder.name,
        schema: FolderSchema,
      },
    ]),
  ],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}

import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TenantsValidator } from './tenants.validator';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './entities/tenant.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/configuration/constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema,
      },
    ]),
    JwtModule.register({
      secret: jwtConstants.accessTokenSecret,
    }),
  ],
  controllers: [TenantsController],
  providers: [TenantsService, TenantsValidator],
  exports: [TenantsService, TenantsValidator],
})
export class TenantsModule {}

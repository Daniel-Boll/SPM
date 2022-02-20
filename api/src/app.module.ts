import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { TenantsModule } from './modules/tenants/tenants.module';
import { TenantsValidator } from './modules/tenants/tenants.validator';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';

import configuration from './configuration/config';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
});

const mongooseModule = MongooseModule.forRootAsync({
  useFactory: async (configService: ConfigService) =>
    configService.get('global'),
  inject: [ConfigService],
});

const tenancyModule = TenancyModule.forRootAsync({
  imports: [TenantsModule],
  useFactory: async (
    configService: ConfigService,
    tenantValidator: TenantsValidator,
  ) => ({
    tenantIdentifier: 'Authorization',
    uri: (tenantIdentifier: string) =>
      `${configService.get('database')}/tenant-${tenantValidator.checkTenantId(
        tenantIdentifier,
      )}?authSource=admin`,
    validator: (tenantId: string) => tenantValidator.setTenantId(tenantId),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    options: () => {},
  }),
  inject: [ConfigService, TenantsValidator],
});

@Module({
  imports: [
    configModule,
    mongooseModule,
    tenancyModule,
    TenantsModule,
    AuthModule,
    UserModule,
    AccountModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

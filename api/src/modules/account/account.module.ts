import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PasswordEncryptionMiddleware } from '../middleware/password-encryption.middleware';
import { TenantsModule } from '../tenants/tenants.module';
import { UserModule } from '../user/user.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account, AccountSchema } from './entities/account.entity';

@Module({
  imports: [
    TenancyModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
    ]),
    UserModule,
    TenantsModule,
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PasswordEncryptionMiddleware).forRoutes(AccountController);
  }
}

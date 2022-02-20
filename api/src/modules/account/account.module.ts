import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UserModule } from '../user/user.module';
import { TenantsModule } from '../tenants/tenants.module';
import { PasswordEncryptionMiddleware } from '../middleware/password-encryption.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, TenantsModule, AuthModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PasswordEncryptionMiddleware).forRoutes(AccountController);
  }
}

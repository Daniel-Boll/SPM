import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { Password, PasswordSchema } from './entities/password.entity';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TenancyModule.forFeature([
      {
        name: Password.name,
        schema: PasswordSchema,
      },
    ]),
    AccountModule,
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}

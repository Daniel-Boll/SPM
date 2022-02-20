import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    TenancyModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

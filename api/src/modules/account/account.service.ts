import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { TenantsService } from '../tenants/tenants.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { Account } from './entities/account.entity';
import { Model } from 'mongoose';

@Injectable()
export class AccountService {
  constructor(
    private readonly userService: UserService,
    private readonly tenantsService: TenantsService,
    @InjectTenancyModel(Account.name)
    private readonly accountModel: Model<Account>,
  ) {}

  async activate({
    domain,
    user,
  }: {
    domain: string;
    user: {
      name: string;
      masterPassword: string;
    };
  }) {
    const { ownerEmail } = await this.tenantsService.activate(domain);

    await this.userService.create({
      name: user.name,
      masterPassword: user.masterPassword,
      email: ownerEmail,
    });

    return {
      domain,
      ownerEmail,
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  async secret() {
    return (await this.accountModel.findOne({})).secret;
  }
}

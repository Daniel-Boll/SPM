import { Injectable } from '@nestjs/common';
import { TenantsService } from '../tenants/tenants.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly userService: UserService,
    private readonly tenantsService: TenantsService,
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
}

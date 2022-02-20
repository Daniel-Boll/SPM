import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AccountService } from './account.service';
import { ActivateAccountDto } from './dto/activate-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/activate/:domain')
  async activate(
    @Param('domain') domain: string,
    @Body() { user }: ActivateAccountDto,
  ) {
    return this.accountService.activate({
      domain,
      user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.accountService.createUser(createUserDto);
  }
}

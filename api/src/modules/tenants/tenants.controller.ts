import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get('validate/:tenantId')
  async validate(@Param('tenantId') tenantId: string) {
    return this.tenantsService.validate(tenantId.toLowerCase());
  }
}

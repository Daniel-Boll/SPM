import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TenancyValidator } from '@needle-innovision/nestjs-tenancy';
import { Model } from 'mongoose';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsValidator implements TenancyValidator {
  private _tenantId: string;

  constructor(
    @InjectModel('Tenant') private tenantModel: Model<Tenant>,
    private readonly jwtService: JwtService,
  ) {}

  checkTenantId(tenantId: string): string {
    let _tenantId = tenantId;

    if (tenantId.includes('Bearer')) {
      const payload = this.jwtService.decode(tenantId.replace('Bearer ', ''));

      if (!payload) throw new NotFoundException(`Tenant not found`);

      _tenantId = payload['data']['subdomain'];
    }

    return _tenantId;
  }

  setTenantId(tenantId: string): TenancyValidator {
    this._tenantId = this.checkTenantId(tenantId);
    return this;
  }

  async validate(): Promise<void> {
    const exist = await this.tenantModel.findOne({ subdomain: this._tenantId });

    if (!exist) throw new NotFoundException(`Workspace not found`);
  }
}

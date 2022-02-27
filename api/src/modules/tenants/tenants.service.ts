import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<Tenant>,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createTenantDto: CreateTenantDto,
  ): Promise<Tenant & { _id: any }> {
    let createdTenant;
    try {
      createdTenant = await this.tenantModel.create({
        ...createTenantDto,
        active: false,
      });
    } catch (err) {
      this.logger.error(err);
      const error =
        err.code === 11000
          ? new ConflictException('Tenant already exists')
          : new Error('Error creating tenant');

      throw error;
    }

    try {
      const mongoClient = mongoose.createConnection(
        `${this.configService.get('database')}/tenant-${
          createdTenant.subdomain
        }`,
        {
          authSource: 'admin',
        },
      );

      await mongoClient.collection('account').insertOne({
        subdomain: createdTenant.subdomain,
        name: createdTenant.name,
        secret: randomUUID(),
      });

      await mongoClient.close();
    } catch (err) {
      this.logger.error(err);
      throw new Error('Error creating tenant');
    }

    return createdTenant;
  }

  private async findByDomain(
    subdomain: string,
  ): Promise<Tenant & { _id: string }> {
    return await this.tenantModel.findOne({ subdomain }).exec();
  }

  async validate(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantModel.find({ subdomain }).exec();

    if (tenant.length === 0) throw new NotFoundException('Tenant not found');
    if (tenant[0].active === false)
      throw new UnauthorizedException('Tenant not activated');

    return tenant[0];
  }

  async activate(domain: string): Promise<Tenant> {
    const tenant = await this.findByDomain(domain);

    return await this.tenantModel
      .findByIdAndUpdate(tenant._id, {
        active: true,
      })
      .exec();
  }
}

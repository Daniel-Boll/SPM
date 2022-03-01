export class CreateTenantDto {
  subdomain: string;
  name: string;
  active?: boolean;
  ownerEmail: string;
  callback: string;
}

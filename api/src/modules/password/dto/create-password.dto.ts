interface Metadata {
  priority: number;
  name: string;
}

export class CreatePasswordDto {
  password: string;
  folder: string;
  metadata?: Metadata;
}

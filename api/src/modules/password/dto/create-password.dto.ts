interface Metadata {
  priority: number;
}

export class CreatePasswordDto {
  password: string;
  folder: string;
  metadata?: Metadata;
}

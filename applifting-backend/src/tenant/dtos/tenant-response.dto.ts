import { Expose } from 'class-transformer';

export class TenantResponseDto {
  @Expose()
  tenantId: string;

  @Expose()
  apiKey: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: string;

  @Expose()
  lastUsedAt: string | null;
}

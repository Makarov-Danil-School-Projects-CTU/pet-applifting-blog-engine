import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TenantResponseDto {
  @ApiProperty({ description: 'The unique identifier of the tenant' })
  @Expose()
  tenantId: string;

  @ApiProperty({ description: 'The API key associated with the tenant' })
  @ApiProperty()
  @Expose()
  apiKey: string;

  @ApiProperty({ description: 'The name of the tenant' })
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ description: 'The date the tenant was created' })
  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty({
    description: 'The date the tenant was last used',
    nullable: true,
  })
  @ApiProperty()
  @Expose()
  lastUsedAt: string | null;
}

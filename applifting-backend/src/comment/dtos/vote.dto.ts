import { IsUUID, IsString, IsIn, IsNotEmpty } from 'class-validator';

export class VoteDto {
  @IsUUID()
  @IsNotEmpty()
  commentId: string;

  @IsString()
  @IsIn(['up', 'down'])
  vote: 'up' | 'down';
}

import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsIn, IsNotEmpty } from 'class-validator';

export class VoteDto {
  @ApiProperty({
    description: 'The ID of the comment the vote is related to',
  })
  @IsUUID()
  @IsNotEmpty()
  commentId: string;

  @ApiProperty({ description: 'There are possible solutions how to like (UP) or dislike (DOWN) a post' })
  @IsString()
  @IsIn(['UP', 'DOWN'])
  vote: 'UP' | 'DOWN';
}

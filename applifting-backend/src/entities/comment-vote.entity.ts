import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from './comment.entity';
import { Tenant } from './tenant.entity';

@Entity('comment_votes')
export class CommentVote {
  @PrimaryGeneratedColumn('uuid')
  voteId: string;

  @Column()
  ipAddress: string;

  @Column({ type: 'int', default: 0 })
  value: number; // +1 for upvote, -1 for downvote

  @ManyToOne(() => Comment, (comment) => comment.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @ManyToOne(() => Tenant, (tenant) => tenant.commentVotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}

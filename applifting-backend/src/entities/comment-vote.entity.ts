import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from './comment.entity';

@Entity('comment_votes')
export class CommentVote {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  voteId: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  value: number; // +1 for upvote, -1 for downvote

  @ManyToOne(() => Comment, (comment) => comment.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  // @AfterInsert()
  // logInsert() {
  //   console.log('Inserted CommentVote with id', this.voteId);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log('Updated CommentVote with id', this.voteId);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log('Removed CommentVote with id', this.voteId);
  // }
}

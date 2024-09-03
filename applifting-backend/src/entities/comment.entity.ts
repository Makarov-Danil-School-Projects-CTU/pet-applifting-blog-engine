import { IsDate, IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Article } from './article.entity';
import { CommentVote } from './comment-vote.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  commentId: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  author: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  content: string;

  @CreateDateColumn()
  @IsDate()
  postedAt: Date;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  score: number;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @OneToMany(() => CommentVote, (vote) => vote.comment, {
    cascade: true,
  })
  votes: CommentVote[];

  // @AfterInsert()
  // logInsert() {
  //   console.log('Inserted Comment with id', this.commentId);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log('Updated Comment with id', this.commentId);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log('Removed Comment with id', this.commentId);
  // }
}

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
  commentId: string;

  @Column()
  author: string;

  @Column()
  content: string;

  @CreateDateColumn()
  postedAt: Date;

  @Column({ type: 'int', default: 0 })
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

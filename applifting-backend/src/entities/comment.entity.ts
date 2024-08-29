import {
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

  @OneToMany(() => CommentVote, (vote) => vote.comment)
  votes: CommentVote[];
}

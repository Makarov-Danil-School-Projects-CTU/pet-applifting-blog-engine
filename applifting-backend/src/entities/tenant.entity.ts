import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Article } from './article.entity';
import { CommentVote } from './comment-vote.entity';
import { Comment } from './comment.entity';
import { Image } from './image.entity';

@Entity('tenants')
export class Tenant {
  @ApiProperty({ description: 'The unique identifier of the tenant' })
  @PrimaryGeneratedColumn('uuid')
  tenantId: string;

  @ApiProperty({ description: 'The unique apiKey from the external service' })
  @Column({ unique: true })
  apiKey: string;

  @ApiProperty({ description: 'The name of the tenant' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The hashed password of the tenant' })
  @Column()
  password: string;

  @ApiProperty({ description: 'The date when the tenant was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the article was last updated' })
  @UpdateDateColumn({ nullable: true })
  lastUsedAt: Date;

  /**
   * Using cascade (TypeORM level):
   * If you have a parent entity (Tenant) with children (Articles) and want TypeORM to automatically
   * delete associated Articles when you call .remove(tenant) in your application code,
   * you would use cascade: ['remove']. cascade: true includes all the operatins such as insert, update, etc.
   * **/
  @OneToMany(() => Article, (article) => article.tenant, {
    cascade: true,
  })
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.tenant, {
    cascade: true,
  })
  comments: Comment[];

  @OneToMany(() => CommentVote, (commentVote) => commentVote.tenant, {
    cascade: true,
  })
  commentVotes: CommentVote[];

  @OneToOne(() => Image, (image) => image.tenant, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  image: Image;
}

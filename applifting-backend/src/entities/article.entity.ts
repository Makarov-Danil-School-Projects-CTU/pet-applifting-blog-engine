import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Comment } from './comment.entity';
import { Image } from './image.entity';
import { Tenant } from './tenant.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  articleId: string;

  @Column()
  title: string;

  @Column()
  perex: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdatedAt: Date;

  @OneToMany(() => Image, (imageInfo) => imageInfo.article, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @ManyToOne(() => Tenant, (tenant) => tenant.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => Comment, (comment) => comment.article, { nullable: true })
  comments: Comment[];
}

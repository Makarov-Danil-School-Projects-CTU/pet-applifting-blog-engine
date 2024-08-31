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
  UpdateDateColumn,
} from 'typeorm';

import { Comment } from './comment.entity';
import { Tenant } from './tenant.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  articleId: string;

  @Column()
  title: string;

  @Column()
  perex: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdatedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => Comment, (comment) => comment.article, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted Article with id', this.articleId);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Article with id', this.articleId);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Article with id', this.articleId);
  }
}

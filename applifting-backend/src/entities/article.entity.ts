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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Comment } from './comment.entity';
import { Image } from './image.entity';
import { Tenant } from './tenant.entity';

@Entity('articles')
export class Article {
  @ApiProperty({ description: 'The unique identifier of the article' })
  @PrimaryGeneratedColumn('uuid')
  articleId: string;

  @ApiProperty({ description: 'The title of the article' })
  @Column()
  title: string;

  @ApiProperty({ description: 'A short description of the article' })
  @Column()
  perex: string;

  @ApiProperty({ description: 'The content of the article' })
  @Column()
  content: string;

  @ApiProperty({ description: 'The date when the article was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the article was last updated' })
  @UpdateDateColumn({ nullable: true })
  lastUpdatedAt: Date;

   /**
   * Using onDelete (database level):
   * If you have Tenant and Article tables in your database
   * and want to ensure that when an Tenant is deleted,
   * all associated Articles are automatically deleted by the database without any application code,
   * you would set onDelete: 'CASCADE' on the foreign key constraint in the Articles table.
   *
   * */
  @ApiProperty({
    description: 'The ID of the tenant associated with the article',
    type: () => Tenant,
  })
  @ManyToOne(() => Tenant, (tenant) => tenant.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => Comment, (comment) => comment.article, {
    cascade: true,
  })
  comments: Comment[];

  /**
   * When you use onDelete: 'CASCADE' in a One-to-One relationship,
   * deleting a record in the parent table will automatically delete
   * the associated record in the child table.
   *
   */
  @ApiProperty({
    description: 'The ID of the image associated with the article',
    type: () => Tenant,
  })
  @OneToOne(() => Image, (image) => image.article, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  image: Image;

  // @AfterInsert()
  // logInsert() {
  //   console.log('Inserted Article with id', this.articleId);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log('Updated Article with id', this.articleId);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log('Removed Article with id', this.articleId);
  // }
}

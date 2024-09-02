import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Article } from './article.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryColumn('uuid')
  tenantId: string;

  @Column({ unique: true })
  apiKey: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

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

  // @AfterInsert()
  // logInsert() {
  //   console.log('Inserted Tenant with id', this.tenantId);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log('Updated Tenant with id', this.tenantId);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log('Removed Tenant with id', this.tenantId);
  // }
}

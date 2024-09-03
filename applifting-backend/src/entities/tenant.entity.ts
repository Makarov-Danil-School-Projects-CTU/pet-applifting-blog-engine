import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Article } from './article.entity';

@Entity('tenants')
export class Tenant {
  @ApiProperty({ description: 'The unique identifier of the tenant' })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'The unique apiKey from the external service' })
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  apiKey: string;

  @ApiProperty({ description: 'The name of the tenant' })
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The hashed password of the tenant' })
  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'The date when the tenant was created' })
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the article was last updated' })
  @UpdateDateColumn({ nullable: true })
  @IsDate()
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

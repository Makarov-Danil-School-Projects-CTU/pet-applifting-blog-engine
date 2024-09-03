import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Article } from './article.entity';

@Entity('images')
export class Image {
  @ApiProperty({ description: 'The unique identifier of the image' })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  imageId: string;

  @ApiProperty({ description: 'The original name of the uploaded image file' })
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string; // original filename

  @ApiProperty({ description: 'The URL where the uploaded image can be accessed' })
  @Column()
  @IsString()
  @IsNotEmpty()
  url: string; // URL to access the image

  @ApiProperty({ description: 'The MIME type of the uploaded image file' })
  @Column()
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ description: 'The article to which this image belongs', type: () => Article })
  @OneToOne(() => Article, (article) => article.image, { onDelete: 'SET NULL' })
  @JoinColumn()
  article: Article;

  // @AfterInsert()
  // logInsert() {
  //   console.log('Inserted Image with id', this.imageId);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log('Updated Image with id', this.imageId);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log('Removed Image with id', this.imageId);
  // }
}

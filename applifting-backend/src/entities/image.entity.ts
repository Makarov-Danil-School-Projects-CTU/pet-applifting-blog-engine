import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Article } from './article.entity';

@Entity('images')
export class Image {
  @PrimaryColumn('uuid')
  imageId: string;

  @Column()
  name: string; // original filename

  @Column()
  path: string; // Path on the server

  @Column()
  url: string; // URL to access the image

  @ManyToOne(() => Article, (article) => article.image, { onDelete: 'CASCADE' })
  article: Article;
}

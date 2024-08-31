import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

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

  @AfterInsert()
  logInsert() {
    console.log('Inserted Image with id', this.imageId);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Image with id', this.imageId);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Image with id', this.imageId);
  }
}

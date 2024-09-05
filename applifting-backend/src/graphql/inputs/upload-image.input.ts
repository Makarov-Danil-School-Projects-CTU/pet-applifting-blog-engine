import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UploadImageInput {
  @Field()
  articleId: string;

  @Field()
  name: string
  
  @Field()
  mimeType: string
}
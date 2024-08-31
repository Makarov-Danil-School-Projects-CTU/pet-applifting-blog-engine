import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  articleId: string;

  @Field()
  author: string;

  @Field()
  content: string;
}

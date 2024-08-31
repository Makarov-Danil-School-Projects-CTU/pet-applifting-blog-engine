import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateArticleInput {
  @Field()
  title: string;

  @Field()
  perex: string;

  @Field()
  content: string;

  @Field()
  tenantId: string;
}

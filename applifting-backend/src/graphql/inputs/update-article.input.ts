import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  perex?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  tenantId?: string;
}

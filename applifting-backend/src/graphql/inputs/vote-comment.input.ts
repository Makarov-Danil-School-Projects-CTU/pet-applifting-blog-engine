import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum VoteType {
  UP = 'UP',
  DOWN = 'DOWN',
}

// Register the enum with GraphQL
registerEnumType(VoteType, {
  name: 'VoteType', // This name must match the same name used in our GraphQL schema
  description: 'The type of vote, either UP or DOWN',
});

@InputType()
export class VoteCommentInput {
  @Field()
  commentId: string;

  @Field(() => VoteType) // Using the VoteType enum for the vote field
  vote: VoteType;
}

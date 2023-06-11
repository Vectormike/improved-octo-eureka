import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Todo extends BaseModel {
  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => User, { nullable: true })
  author?: User | null;
}

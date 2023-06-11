import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field()
  @IsNotEmpty({ message: 'Completed field is required' })
  completed: boolean;
}

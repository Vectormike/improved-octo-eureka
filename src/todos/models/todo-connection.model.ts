import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from 'src/common/pagination/pagination';
import { Todo } from './todo.model';

@ObjectType()
export class TodoConnection extends PaginatedResponse(Todo) {}

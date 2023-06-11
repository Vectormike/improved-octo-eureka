import { Module } from '@nestjs/common';
import { TodosResolver } from './todo.resolver';

@Module({
  imports: [],
  providers: [TodosResolver],
})
export class TodosModule {}

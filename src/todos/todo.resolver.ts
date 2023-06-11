import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Subscription,
  Mutation,
} from '@nestjs/graphql';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { TodoIdArgs } from './args/todo-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Todo } from './models/todo.model';
import { TodoConnection } from './models/todo-connection.model';
import { TodoOrder } from './dto/todo-order.input';
import { CreateTodoInput } from './dto/createTodo.input';

const pubSub = new PubSub();

@Resolver(() => Todo)
export class TodosResolver {
  constructor(private prisma: PrismaService) {}

  @Subscription(() => Todo)
  postCreated() {
    return pubSub.asyncIterator('todoCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Todo)
  async createTodo(
    @UserEntity() user: User,
    @Args('data') data: CreateTodoInput
  ) {
    const newTodo = this.prisma.todo.create({
      data: {
        completed: true,
        title: data.title,
        description: data.description,
        authorId: user.id,
      },
    });
    pubSub.publish('todoCreated', { todoCreated: newTodo });
    return newTodo;
  }

  @Query(() => TodoConnection)
  async completedTodos(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => TodoOrder,
      nullable: true,
    })
    orderBy: TodoOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.todo.findMany({
          include: { author: true },
          where: {
            completed: true,
            title: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        }),
      () =>
        this.prisma.todo.count({
          where: {
            completed: true,
            title: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
    return a;
  }

  @Query(() => [Todo])
  userTodos(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .todos({ where: { completed: true } });
  }

  @Query(() => Todo)
  async todo(@Args() id: TodoIdArgs) {
    return this.prisma.todo.findUnique({ where: { id: id.todoId } });
  }

  @Query(() => TodoConnection)
  async todos(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => TodoOrder,
      nullable: true,
    })
    orderBy: TodoOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.todo.findMany({
          include: { author: true },
          where: {
            title: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        }),
      () =>
        this.prisma.todo.count({
          where: {
            title: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
    return a;
  }

  @ResolveField('author', () => User)
  async author(@Parent() todo: Todo) {
    return this.prisma.todo.findUnique({ where: { id: todo.id } }).author();
  }

  @Query(() => [Todo])
  async searchTodos(@Args('query') query: string) {
    return this.prisma.todo.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
    });
  }
}

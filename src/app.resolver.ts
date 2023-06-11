import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  helloWorld(): string {
    return 'Hello World!';
  }
  @Query(() => String)
  hello(@Args('name') name: string): string {
    return `Hello ${name}!`;
  }

	// Get list of all todos
	@Query(() => String)
	getTodos(): string {
		return 'Get list of all todos';
	}
	// Get a single todo by id
}

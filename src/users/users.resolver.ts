/* eslint-disable @typescript-eslint/no-empty-function */
import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { User } from './models/user.model';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor() {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }
}

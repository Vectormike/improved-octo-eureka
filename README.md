# Instructions

## Features

- GraphQL w/ [playground](https://github.com/prisma/graphql-playground)
- [Prisma](https://www.prisma.io/) for database modelling, migration and type-safe access (Postgres)
- Docker [Docker](www.docker.com)
- 🔐 JWT authentication w/ [passport-jwt](https://github.com/mikenicholson/passport-jwt)

## Overview

Implement a Node.js based GraphQL API for a Todo List

### Description

Your task is to implement a GraphQL API for a simple Todo List application using Node.js and the following libraries.

- Nest JS as the Node.js framework
- Prisma for database access, querying and migrations
- Docker Compose so all services needed to run/test your submission can be setup easily

The API should support the following operations:

- Create a new Todo item
- Get a list of all Todo items
- Get a specific Todo item by ID
- Search the list of Todo items by title or description

Each Todo item should have the following attributes:

- `id`: a unique identifier for the Todo item
- `title`: a short title for the Todo item (required)
- `description`: a longer description of the Todo item (optional)
- `completed`: a boolean indicating whether the Todo item is completed (default: false )

## Prisma Setup

### 1. Install Dependencies

Install [Nestjs CLI](https://docs.nestjs.com/cli/usages) to start and [generate CRUD resources](https://trilon.io/blog/introducing-cli-generators-crud-api-in-1-minute)

```bash
npm i -g @nestjs/cli
```

Install the dependencies for the Nest application:

```bash
npm install
```

### 2. PostgreSQL with Docker

Setup a development PostgreSQL with Docker. Copy [.env.example](./.env.example) and rename to `.env` - `cp .env.example .env` - which sets the required environments for PostgreSQL such as `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB`. Update the variables as you wish and select a strong password.

Start the PostgreSQL database

```bash
npm run docker:db
```

### 3. Prisma Migrate

[Prisma Migrate](https://github.com/prisma/prisma2/tree/master/docs/prisma-migrate) is used to manage the schema and migration of the database. Prisma datasource requires an environment variable `DATABASE_URL` for the connection to the PostgreSQL database. Prisma reads the `DATABASE_URL` from the root [.env](./.env) file.

```bash
npm run migrate:dev
```

### 4. Prisma: Prisma Client JS

[Prisma Client JS](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/api) is a type-safe database client auto-generated based on the data model.

Generate Prisma Client JS by running

> **Note**: Every time you update [schema.prisma](prisma/schema.prisma) re-generate Prisma Client JS

```bash
npm run prisma:generate
```

### 5. Seed the database data with this script

Execute the script with this command:

```bash
npm run seed
```

### 6. Start NestJS Server

Run Nest Server in Development mode:

```bash
npm run start

# watch mode
npm run start:dev
```

GraphQL Playground for the NestJS Server is available here: http://localhost:3000/graphql

## GraphQL Playground

Open up the [example GraphQL queries](graphql/auth.graphql) and copy them to the GraphQL Playground. All queries and mutations are secured by an auth guard. You have to acquire a JWT token from `signup` or `login`. Add the `accessToken`as followed to **HTTP HEADERS** in the playground and replace `YOURTOKEN` here:

```json
{
  "Authorization": "Bearer YOURTOKEN"
}
```

## Rest Api

[RESTful API](http://localhost:3000/api) documentation available with Swagger.

## Docker

Now to build a Docker image of the Nest server, simply run:

```bash
docker build -t earnipay .
```

After Docker build your docker image you are ready to start up a docker container running the nest server:

```bash
docker run -d -t -p 3000:3000 --env-file .env earnipay
```

Now open up [localhost:3000](http://localhost:3000) to verify that your nest server is running.

When you run your NestJS application in a Docker container update your [.env](.env) file

```diff
- DB_HOST=localhost
# replace with name of the database container
+ DB_HOST=postgres

# Prisma database connection
+ DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}&sslmode=prefer
```

### Docker Compose

You can also setup a the database and Nest application with the docker-compose

```bash
# building new NestJS docker image
npm run docker:build

# start docker-compose
npm run docker
```

## Schema Development

Update the Prisma schema `prisma/schema.prisma` and after that run the following two commands:

```bash
npx prisma generate
# or in watch mode
npx prisma generate --watch
# or
npm run prisma:generate
npm run prisma:generate:watch
```

## GraphQL Client

A GraphQL client is necessary to consume the GraphQL api provided by the NestJS Server.

Checkout [Apollo](https://www.apollographql.com/) a popular GraphQL client which offers several clients for React, Angular, Vue.js, Native iOS, Native Android and more.

**[⬆ back to top](#overview)**

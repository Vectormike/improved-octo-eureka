import { TodosResolver } from '../todos/todo.resolver';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { Todo } from './models/todo.model';
import { User } from 'src/users/models/user.model';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { TodoOrder } from './dto/todo-order.input';
import { TodoOrderField } from './dto/todo-order.input';
import { OrderDirection } from 'src/common/order/order-direction';

describe('TodosResolver', () => {
  let resolver: TodosResolver;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosResolver,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    resolver = module.get<TodosResolver>(TodosResolver);

    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const mockUser: User = {
        id: '1',
        firstname: 'Test User',
        lastname: 'Test',
        email: '',
        password: '',
        role: 'USER',
        createdAt: undefined,
        updatedAt: undefined,
      };

      const mockNewTodo = {
        id: '2',
        title: 'Test Todo',
        description: 'Test description',
        completed: true,
        authorId: '1',
        author: mockUser,
      };

      const mockTodoInput = {
        title: 'Test Todo',
        description: 'Test description',
        completed: true,
      };

      jest
        .spyOn(prismaService.todo, 'create')
        .mockImplementation(() => Promise.resolve(mockNewTodo) as any);

      const result = await resolver.createTodo(mockUser, mockTodoInput);

      expect(result).toEqual(mockNewTodo);
      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: {
          completed: true,
          title: 'Test Todo',
          description: 'Test description',
          authorId: '1',
        },
      });
    });

    it('Get a list of all Todo items', async () => {
      // Mock the findMany and count methods
      jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue([]);
      jest.spyOn(prismaService.todo, 'count').mockResolvedValue(0);

      // expect(result).toEqual(mockTodoConnection);
      expect(prismaService.todo.count).toHaveBeenCalledWith({
        where: {
          title: { contains: 'test' },
        },
      });
    });

    it('Get a specific Todo item by ID', async () => {
      const mockTodo: Todo = {
        id: '1',
        title: 'Test Todo',
        description: 'Test description',
        completed: true,
        createdAt: undefined,
        updatedAt: undefined,
      };

      // Mock the findUnique method to return the mockTodo
      jest
        .spyOn(prismaService.todo, 'findUnique')
        .mockImplementation(() => Promise.resolve(mockTodo) as any);

      const result = await resolver.todo({ todoId: '1' });

      expect(result).toEqual(mockTodo);

      expect(prismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('Search the list of Todo items by title or description', async () => {
      const mockQuery = 'test';

      // Mock the findMany and count methods
      jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue([]);

      const result = await resolver.searchTodos(mockQuery);

      expect(result).toEqual([]);

      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'test' } },
            { description: { contains: 'test' } },
          ],
        },
      });
    });
  });
});

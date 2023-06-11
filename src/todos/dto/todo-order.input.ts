import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/common/order/order';

export enum TodoOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  completed = 'completed',
  title = 'title',
  description = 'description',
}

registerEnumType(TodoOrderField, {
  name: 'TodoOrderField',
  description: 'Properties by which post connections can be ordered.',
});

@InputType()
export class TodoOrder extends Order {
  field: TodoOrderField;
}

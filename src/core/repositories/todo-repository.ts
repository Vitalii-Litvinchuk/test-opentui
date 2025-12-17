import { todos, type NewTodo, type Todo } from '../db/schema';
import { BaseRepository } from './base-repository';

export class TodoRepository extends BaseRepository<Todo, NewTodo> {
    constructor() {
        super('todos', todos);
    }

    async toggle(id: number, currentStatus: boolean): Promise<void> {
        await this.update(id, { completed: !currentStatus });
    }
}

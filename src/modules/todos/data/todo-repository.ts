import { BaseRepository } from '../../../core/repositories/base-repository';
import { todos, type Todo, type NewTodo } from '../domain/schema';

export class TodoRepository extends BaseRepository<Todo, NewTodo> {
    constructor() {
        super('todos', todos);
    }

    async toggle(id: number, currentStatus: boolean): Promise<void> {
        await this.update(id, { completed: !currentStatus });
    }
}

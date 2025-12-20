import { BaseRequest, type IRequestHandler } from "../../../../core/mediator";
import { Result } from "../../../../core/common/result";
import { TodoRepository } from "../../data/todo-repository";
import type { Todo } from "../../domain/schema";
import { AppError } from "../../../../core/common/app-error";

export class GetTodosQuery extends BaseRequest<Todo[]> { }

export class GetTodosHandler implements IRequestHandler<GetTodosQuery, Todo[]> {
    constructor(private repository: TodoRepository) { }

    async handle(request: GetTodosQuery): Promise<Result<Todo[]>> {
        try {
            const todos = await this.repository.getAll();
            return Result.ok(todos);
        } catch (e: any) {
            return Result.fail(AppError.critical(e.message || "Failed to get todos"));
        }
    }
}

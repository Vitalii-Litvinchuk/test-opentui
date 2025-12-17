import { BaseRequest, type IRequestHandler } from "../../../mediator";
import { Result } from "../../../common/result";
import { TodoRepository } from "../../../repositories/todo-repository";
import type { Todo } from "../../../db/schema";
import { AppError } from "../../../common/app-error";

export class CreateTodoCommand extends BaseRequest<Todo> {
    constructor(public content: string) { super(); }
}

export class CreateTodoHandler implements IRequestHandler<CreateTodoCommand, Todo> {
    constructor(private repository: TodoRepository) { }

    async handle(request: CreateTodoCommand): Promise<Result<Todo>> {
        if (!request.content || request.content.trim().length === 0) {
            return Result.fail(AppError.warning("Todo content cannot be empty"));
        }

        try {
            const todo = await this.repository.create({ content: request.content });
            return Result.ok(todo);
        } catch (e: any) {
            return Result.fail(AppError.critical(e.message || "Failed to create todo"));
        }
    }
}

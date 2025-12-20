import { BaseRequest, type IRequestHandler } from "../../../../core/mediator";
import { Result } from "../../../../core/common/result";
import { TodoRepository } from "../../data/todo-repository";
import type { Todo } from "../../domain/schema";
import { AppError } from "../../../../core/common/app-error";

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

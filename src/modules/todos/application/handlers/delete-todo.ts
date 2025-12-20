import { BaseRequest, type IRequestHandler } from "../../../../core/mediator";
import { Result } from "../../../../core/common/result";
import { TodoRepository } from "../../data/todo-repository";
import { AppError } from "../../../../core/common/app-error";

export class DeleteTodoCommand extends BaseRequest<void> {
    constructor(public id: number) { super(); }
}

export class DeleteTodoHandler implements IRequestHandler<DeleteTodoCommand, void> {
    constructor(private repository: TodoRepository) { }

    async handle(request: DeleteTodoCommand): Promise<Result<void>> {
        try {
            await this.repository.delete(request.id);
            return Result.ok(undefined);
        } catch (e: any) {
            return Result.fail(AppError.critical(e.message || "Failed to delete todo"));
        }
    }
}

import { BaseRequest, type IRequestHandler } from "../../../mediator";
import { Result } from "../../../common/result";
import { TodoRepository } from "../../../repositories/todo-repository";
import { AppError } from "../../../common/app-error";

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

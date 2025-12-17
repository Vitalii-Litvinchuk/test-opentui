import { BaseRequest, type IRequestHandler } from "../../../mediator";
import { Result } from "../../../common/result";
import { TodoRepository } from "../../../repositories/todo-repository";
import { AppError } from "../../../common/app-error";

export class ToggleTodoCommand extends BaseRequest<void> {
    constructor(public id: number, public currentStatus: boolean) { super(); }
}

export class ToggleTodoHandler implements IRequestHandler<ToggleTodoCommand, void> {
    constructor(private repository: TodoRepository) { }

    async handle(request: ToggleTodoCommand): Promise<Result<void>> {
        try {
            await this.repository.toggle(request.id, request.currentStatus);
            return Result.ok(undefined);
        } catch (e: any) {
            return Result.fail(AppError.critical(e.message || "Failed to toggle todo"));
        }
    }
}

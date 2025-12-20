import { BaseRequest, type IRequestHandler } from "../../../../core/mediator";
import { Result } from "../../../../core/common/result";
import { CategoryRepository } from "../../data/category-repository";
import type { Category } from "../../domain/schema";
import { AppError } from "../../../../core/common/app-error";

export class CreateCategoryCommand extends BaseRequest<Category> {
    constructor(public name: string) { super(); }
}

export class CreateCategoryHandler implements IRequestHandler<CreateCategoryCommand, Category> {
    constructor(private repository: CategoryRepository) { }

    async handle(request: CreateCategoryCommand): Promise<Result<Category>> {
        if (!request.name || request.name.trim().length === 0) {
            return Result.fail(AppError.warning("Category name cannot be empty"));
        }

        try {
            const category = await this.repository.create({ name: request.name });
            return Result.ok(category);
        } catch (e: any) {
            return Result.fail(AppError.critical(e.message || "Failed to create category"));
        }
    }
}

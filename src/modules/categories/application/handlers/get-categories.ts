import { BaseRequest, type IRequestHandler } from "../../../../core/mediator";
import { Result } from "../../../../core/common/result";
import { CategoryRepository } from "../../data/category-repository";
import type { Category } from "../../domain/schema";
import { AppError } from "../../../../core/common/app-error";

export class GetCategoriesQuery extends BaseRequest<Category[]> { }

export class GetCategoriesHandler implements IRequestHandler<GetCategoriesQuery, Category[]> {
    constructor(private repository: CategoryRepository) { }

    async handle(request: GetCategoriesQuery): Promise<Result<Category[]>> {
        try {
            const categories = await this.repository.getAll();
            return Result.ok(categories);
        } catch (e: any) {
            return Result.fail(AppError.critical(e.message || "Failed to get categories"));
        }
    }
}

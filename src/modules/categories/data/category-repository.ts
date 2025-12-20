import { BaseRepository } from '../../../core/repositories/base-repository';
import { categories, type Category, type NewCategory } from '../domain/schema';

export class CategoryRepository extends BaseRepository<Category, NewCategory> {
    constructor() {
        super('categories', categories);
    }
}

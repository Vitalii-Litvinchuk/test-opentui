import { create } from 'zustand';
import { mediator } from '../../../../core/mediator';
import { GetCategoriesQuery } from '../../application/handlers/get-categories';
import { CreateCategoryCommand } from '../../application/handlers/create-category';
import { AppError } from '../../../../core/common/app-error';
import { Result } from '../../../../core/common/result';
import type { Category } from '../../domain/schema';
import { useErrorStore } from '../../../../store/useErrorStore';

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: AppError | null;

    fetchCategories: () => Promise<void>;
    addCategory: (name: string) => Promise<Result<Category>>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        const result = await mediator.send(new GetCategoriesQuery());

        if (result.isSuccess) {
            set({ categories: result.getValue(), isLoading: false });
        } else {
            useErrorStore.getState().addError(result.error);
            set({ error: result.error, isLoading: false });
        }
    },

    addCategory: async (name: string): Promise<Result<Category>> => {
        const result = await mediator.send(new CreateCategoryCommand(name));

        if (result.isSuccess) {
            set((state) => ({ categories: [...state.categories, result.getValue()] }));
        } else {
            useErrorStore.getState().addError(result.error);
            set({ error: result.error });
            setTimeout(() => set({ error: null }), 3000);
        }
        return result;
    }
}));

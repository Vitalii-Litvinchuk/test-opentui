import { container } from "../../core/di";
import { mediator } from "../../core/mediator";
import { useRouterStore } from "../../components/router/store/useRouterStore";
import { Routes } from "../../core/router/constants";
import { CategoryList } from "./presentation/category-list";
import { CategoryForm } from "./presentation/category-form";
import { CategoryRepository } from "./data/category-repository";
import { CreateCategoryCommand, CreateCategoryHandler } from "./application/handlers/create-category";
import { GetCategoriesHandler, GetCategoriesQuery } from "./application/handlers/get-categories";

declare module "../../core/router/constants" {
    interface AppRoutes {
        CATEGORIES: {
            LIST: string;
            ADD: string;
        }
    }
}

export function registerCategoriesHandlers() {
    container.registerScopedClass(CategoryRepository.name, CategoryRepository);

    mediator.register(GetCategoriesQuery, GetCategoriesHandler, [CategoryRepository.name]);
    mediator.register(CreateCategoryCommand, CreateCategoryHandler, [CategoryRepository.name]);

    useRouterStore.getState().registerRoute({
        path: Routes.CATEGORIES.LIST,
        title: 'Categories',
        component: <CategoryList />,
        isMain: true
    });

    useRouterStore.getState().registerRoute({
        path: Routes.CATEGORIES.ADD,
        title: 'New Category',
        component: <CategoryForm />,
        isMain: false
    });
}

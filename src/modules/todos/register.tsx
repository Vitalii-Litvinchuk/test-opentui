import { container } from "../../core/di";
import { mediator } from "../../core/mediator";
import { useRouterStore } from "../../components/router/store/useRouterStore";
import { Routes } from "../../core/router/constants";
import { TodoList } from "./presentation/todo-list";
import { TodoForm } from "./presentation/todo-form";
import { TodoRepository } from "./data/todo-repository";
import { CreateTodoCommand, CreateTodoHandler } from "./application/handlers/create-todo";
import { DeleteTodoCommand, DeleteTodoHandler } from "./application/handlers/delete-todo";
import { GetTodosHandler, GetTodosQuery } from "./application/handlers/get-todos";
import { ToggleTodoCommand, ToggleTodoHandler } from "./application/handlers/toggle-todo";

declare module "../../core/router/constants" {
    interface AppRoutes {
        HOME: string;
        TODO: {
            ADD: string;
        }
    }
}

export function registerTodoHandlers() {
    container.registerScopedClass(TodoRepository.name, TodoRepository);

    mediator.register(GetTodosQuery, GetTodosHandler, [TodoRepository.name]);
    mediator.register(CreateTodoCommand, CreateTodoHandler, [TodoRepository.name]);
    mediator.register(ToggleTodoCommand, ToggleTodoHandler, [TodoRepository.name]);
    mediator.register(DeleteTodoCommand, DeleteTodoHandler, [TodoRepository.name]);

    useRouterStore.getState().registerRoute({
        path: Routes.HOME,
        title: 'Todo List',
        component: <TodoList />,
        isMain: true
    });

    useRouterStore.getState().registerRoute({
        path: Routes.TODO.ADD,
        title: 'New Todo',
        component: <TodoForm />,
        isMain: false
    });
}

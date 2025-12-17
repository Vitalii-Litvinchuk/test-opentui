import { container } from "../../di";
import { mediator } from "../../mediator";
import { TodoRepository } from "../../repositories/todo-repository";
import { CreateTodoCommand, CreateTodoHandler } from "./handlers/create-todo";
import { DeleteTodoCommand, DeleteTodoHandler } from "./handlers/delete-todo";
import { GetTodosHandler, GetTodosQuery } from "./handlers/get-todos";
import { ToggleTodoCommand, ToggleTodoHandler } from "./handlers/toggle-todo";

export function registerTodoHandlers() {
    container.registerSingletonClass(TodoRepository.name, TodoRepository);

    mediator.register(GetTodosQuery, GetTodosHandler, [TodoRepository.name]);
    mediator.register(CreateTodoCommand, CreateTodoHandler, [TodoRepository.name]);
    mediator.register(ToggleTodoCommand, ToggleTodoHandler, [TodoRepository.name]);
    mediator.register(DeleteTodoCommand, DeleteTodoHandler, [TodoRepository.name]);
}

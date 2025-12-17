import { create } from 'zustand';
import type { Todo } from '../db/schema';
import { mediator } from '../mediator';
import { GetTodosQuery } from '../features/todos/handlers/get-todos';
import { CreateTodoCommand } from '../features/todos/handlers/create-todo';
import { ToggleTodoCommand } from '../features/todos/handlers/toggle-todo';
import { DeleteTodoCommand } from '../features/todos/handlers/delete-todo';
import { AppError } from '../common/app-error';

interface TodoState {
    todos: Todo[];
    isLoading: boolean;
    error: AppError | null;

    fetchTodos: () => Promise<void>;
    addTodo: (content: string) => Promise<void>;
    toggleTodo: (id: number, currentStatus: boolean) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
    todos: [],
    isLoading: false,
    error: null,

    fetchTodos: async () => {
        set({ isLoading: true, error: null });
        const result = await mediator.send(new GetTodosQuery());

        if (result.isSuccess) {
            set({ todos: result.getValue(), isLoading: false });
        } else {
            set({ error: result.error, isLoading: false });
        }
    },

    addTodo: async (content: string) => {
        const result = await mediator.send(new CreateTodoCommand(content));

        if (result.isSuccess) {
            set((state) => ({ todos: [...state.todos, result.getValue()] }));
        } else {
            set({ error: result.error });
            setTimeout(() => set({ error: null }), 3000);
        }
    },

    toggleTodo: async (id: number, currentStatus: boolean) => {
        const oldTodos = get().todos;
        set((state) => ({
            todos: state.todos.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        }));

        const result = await mediator.send(new ToggleTodoCommand(id, currentStatus));

        if (result.isFailure) {
            set({ todos: oldTodos, error: result.error });
            setTimeout(() => set({ error: null }), 3000);
        }
    },

    deleteTodo: async (id: number) => {
        const oldTodos = get().todos;
        set((state) => ({
            todos: state.todos.filter((t) => t.id !== id)
        }));

        const result = await mediator.send(new DeleteTodoCommand(id));

        if (result.isFailure) {
            set({ todos: oldTodos, error: result.error });
            setTimeout(() => set({ error: null }), 3000);
        }
    }
}));

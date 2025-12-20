import { create } from 'zustand';
import { mediator } from '../../../../core/mediator';
import { GetTodosQuery } from '../../application/handlers/get-todos';
import { CreateTodoCommand } from '../../application/handlers/create-todo';
import { ToggleTodoCommand } from '../../application/handlers/toggle-todo';
import { DeleteTodoCommand } from '../../application/handlers/delete-todo';
import { AppError } from '../../../../core/common/app-error';
import { Result } from '../../../../core/common/result';
import type { Todo } from '../../domain/schema';
import { useErrorStore } from '../../../../store/useErrorStore';

interface TodoState {
    todos: Todo[];
    isLoading: boolean;
    error: AppError | null;

    fetchTodos: () => Promise<void>;
    addTodo: (content: string) => Promise<Result<Todo>>;
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
            useErrorStore.getState().addError(result.error);
            set({ error: result.error, isLoading: false });
        }
    },

    addTodo: async (content: string): Promise<Result<Todo>> => {
        const result = await mediator.send(new CreateTodoCommand(content));

        if (result.isSuccess) {
            set((state) => ({ todos: [...state.todos, result.getValue()] }));
        } else {
            useErrorStore.getState().addError(result.error);
            set({ error: result.error });
            setTimeout(() => set({ error: null }), 3000);
        }
        return result;
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
            useErrorStore.getState().addError(result.error);
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
            useErrorStore.getState().addError(result.error);
            set({ todos: oldTodos, error: result.error });
            setTimeout(() => set({ error: null }), 3000);
        }
    }
}));

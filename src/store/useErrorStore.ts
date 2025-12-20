import { create } from 'zustand';
import { AppError } from '../core/common/app-error';

interface ErrorEntry {
    id: string;
    error: AppError;
    timestamp: number;
}

interface ErrorStore {
    errors: ErrorEntry[];
    addError: (error: AppError) => void;
    clearErrors: () => void;
    removeError: (id: string) => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
    errors: [],
    addError: (error) => set((state) => ({
        errors: [...state.errors, {
            id: Math.random().toString(36).substring(7),
            error,
            timestamp: Date.now()
        }]
    })),
    clearErrors: () => set({ errors: [] }),
    removeError: (id) => set((state) => ({
        errors: state.errors.filter(e => e.id !== id)
    })),
}));

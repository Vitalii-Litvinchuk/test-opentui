import type { ReactNode } from 'react';
import { create } from 'zustand';
import { Routes } from '../../../core/router/constants';
import type { RoutePath } from '../../../core/router/constants';

export interface RouteDefinition {
    path: RoutePath | string;
    title: string;
    component: ReactNode;
    isMain?: boolean;
}

interface RouterState {
    currentView: RoutePath | string;
    previousView: (RoutePath | string) | null;
    currentTitle: string;
    routes: RouteDefinition[];
    navigate: (view: RoutePath | string, title?: string) => void;
    registerRoute: (route: RouteDefinition) => void;
    goBack: () => void;
}

export const useRouterStore = create<RouterState>((set) => ({
    currentView: Routes.HOME,
    previousView: null,
    currentTitle: "Todo List",
    routes: [],
    navigate: (view, title) => set((state) => {
        const route = state.routes.find(r => r.path === view);
        return {
            previousView: state.currentView,
            currentView: view,
            currentTitle: title ?? route?.title ?? state.currentTitle
        };
    }),
    registerRoute: (route) => set((state) => ({
        routes: [...state.routes.filter(r => r.path !== route.path), route]
    })),
    goBack: () => set((state) => {
        if (!state.previousView) return state;
        const prevRoute = state.routes.find(r => r.path === state.previousView);
        return {
            currentView: state.previousView,
            previousView: null,
            currentTitle: prevRoute?.title ?? state.currentTitle
        };
    })
}));

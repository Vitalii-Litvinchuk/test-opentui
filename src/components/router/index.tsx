import type { ReactNode, ReactElement } from "react";
import React, { useEffect } from "react";
import { useRouterStore } from "./store/useRouterStore";
import { useKeyboard } from "@opentui/react";
import { Routes } from "../../core/router/constants";
import { Navigation } from "../navigation";

interface RouteProps {
    path: string;
    title?: string;
    isMain?: boolean;
    children: ReactNode;
}

export function Route({ children }: RouteProps) {
    return <>{children}</>;
}

interface RouterProps {
    children?: ReactNode;
}

export function Router({ children }: RouterProps) {
    const { currentView, navigate, routes: registeredRoutes, currentTitle, goBack } = useRouterStore();
    const childRoutes = React.Children.toArray(children) as ReactElement<RouteProps>[];

    const allRoutes = React.useMemo(() => {
        const discovered = [
            ...childRoutes.map(child => ({
                path: child.props.path,
                title: child.props.title,
                component: child.props.children,
                isMain: child.props.isMain
            })),
            ...registeredRoutes.map(route => ({
                path: route.path,
                title: route.title,
                component: route.component,
                isMain: route.isMain
            }))
        ];

        discovered.forEach(r => {
            if (!r.path) return;
            const key = r.path.toString().toUpperCase().replace(/-/g, '_');
            if (!(key in Routes)) {
                Routes[key] = r.path.toString();
            }
        });

        return discovered;
    }, [childRoutes.length, registeredRoutes]);

    const activeRoute = allRoutes.find(r => r.path === currentView);

    useKeyboard((key: { name: string }) => {
        if (key.name === "tab") {
            const currentRoute = allRoutes.find(r => r.path === currentView);
            if ((currentRoute && currentRoute.isMain === false) || currentView === Routes.NAVIGATION) {
                goBack();
            } else {
                navigate(Routes.NAVIGATION);
            }
        }
    });

    useEffect(() => {
        if (activeRoute?.title && activeRoute.title !== currentTitle) {
            navigate(currentView, activeRoute.title);
        }
    }, [currentView, activeRoute?.title, currentTitle, navigate]);

    return (
        <>
            {allRoutes.find(r => r.path === Routes.NAVIGATION) === undefined && currentView === Routes.NAVIGATION && (
                <Navigation />
            )}
            {activeRoute ? <>{activeRoute.component}</> : null}
        </>
    );
}

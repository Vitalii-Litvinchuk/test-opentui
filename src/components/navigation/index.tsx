import { useKeyboard } from "@opentui/react";
import { useEffect, useState } from "react";
import { useRouterStore } from "../router/store/useRouterStore";
import { TextAttributes } from "@opentui/core";

declare module "../../core/router/constants.ts" {
    interface AppRoutes {
        NAVIGATION: string;
    }
}

export function Navigation() {
    const { routes, navigate, currentView } = useRouterStore();
    const mainRoutes = routes.filter(r => r.isMain !== false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const currentIndex = mainRoutes.findIndex(r => r.path === currentView);
        if (currentIndex !== -1) {
            setSelectedIndex(currentIndex);
        }
    }, []);

    useKeyboard((key) => {
        if (key.name === "up") {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : mainRoutes.length - 1));
        }
        if (key.name === "down") {
            setSelectedIndex((prev) => (prev < mainRoutes.length - 1 ? prev + 1 : 0));
        }
        if (key.name === "return") {
            const selectedRoute = mainRoutes[selectedIndex];
            if (selectedRoute) {
                navigate(selectedRoute.path, selectedRoute.title);
            }
        }
    });

    return (
        <box flexDirection="column" padding={1} borderStyle="single" borderColor="cyan">
            <text attributes={TextAttributes.BOLD} style={{ fg: "cyan" }} marginBottom={1}>
                MAIN NAVIGATION
            </text>
            {mainRoutes.map((route, index) => (
                <box key={route.path.toString()} marginBottom={0}>
                    <text
                        style={{
                            fg: index === selectedIndex ? "black" : "white",
                            bg: index === selectedIndex ? "cyan" : "transparent"
                        }}
                    >
                        {index === selectedIndex ? "> " : "  "}
                        {route.title}
                    </text>
                </box>
            ))}
            <box marginTop={1}>
                <text attributes={TextAttributes.DIM}>
                    [UP/DOWN] Select | [ENTER] Navigate
                </text>
            </box>
        </box>
    );
}

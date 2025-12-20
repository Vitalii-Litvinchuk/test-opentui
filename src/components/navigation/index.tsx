import { useRouterStore } from "../router/store/useRouterStore";
import { TextAttributes } from "@opentui/core";
import { Focusable } from "../focusable";

declare module "../../core/router/constants.ts" {
    interface AppRoutes {
        NAVIGATION: string;
    }
}

export function Navigation() {
    const { routes, navigate } = useRouterStore();
    const mainRoutes = routes.filter(r => r.isMain !== false);

    return (
        <box flexDirection="column" padding={1} borderStyle="single" borderColor="cyan">
            <text attributes={TextAttributes.BOLD} style={{ fg: "cyan" }} marginBottom={1}>
                MAIN NAVIGATION
            </text>
            {mainRoutes.map((route) => (
                <Focusable key={route.path.toString()} onAction={() => navigate(route.path, route.title)}>
                    {(isFocused) => (
                        <box marginBottom={0}>
                            <text
                                style={{
                                    fg: isFocused ? "black" : "white",
                                    bg: isFocused ? "cyan" : "transparent"
                                }}
                            >
                                {isFocused ? "> " : "  "}
                                {route.title}
                            </text>
                        </box>
                    )}
                </Focusable>
            ))}
            <box marginTop={1}>
                <text attributes={TextAttributes.DIM}>
                    [ARROWS] Select | [SPACE] Navigate
                </text>
            </box>
        </box>
    );
}

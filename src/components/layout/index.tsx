import { TextAttributes } from "@opentui/core";
import type { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
    title?: string;
}

export function Layout({ children, title = "Todo App" }: LayoutProps) {
    return (
        <box flexDirection="column" padding={1}>
            <box marginBottom={1}>
                <ascii-font font="tiny" text={title} />
            </box>

            <text attributes={TextAttributes.BOLD}>State: Zustand + Mediator | DB: Drizzle</text>

            <box flexDirection="column" marginTop={1}>
                {children}
            </box>

            <box marginTop={1} borderStyle="single" borderColor="grey">
                <text attributes={TextAttributes.DIM}>
                    [TAB] Switch View | [Q] Quit
                </text>
            </box>
        </box>
    );
}

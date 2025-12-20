import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import type { ReactNode } from "react";
import { useRouterStore } from "../router/store/useRouterStore";
import { useErrorStore } from "../../store/useErrorStore";
import { Routes } from "../../core/router/constants";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { currentTitle, currentView, navigate } = useRouterStore();
    const { errors, clearErrors } = useErrorStore();

    useKeyboard((key) => {
        if (key.name === "q") {
            process.exit(0);
        }
        if ((key.name === 'r' || key.name === 'R') && key.ctrl) {
            clearErrors();
        }
    });


    return (
        <box flexDirection="column" flexGrow={1} padding={1}>
            <box marginBottom={1} flexDirection="column">
                <ascii-font font="tiny" text={currentTitle} />
                <text attributes={TextAttributes.BOLD} style={{ fg: "cyan" }}>
                    State: Zustand + Mediator | DB: Drizzle
                </text>
            </box>

            <box flexDirection="column" flexGrow={1}>
                {children}
            </box>

            {/* Error Overlay/Footer */}
            {errors.length > 0 && (
                <box flexDirection="column" marginTop={1} borderStyle="double" borderColor="red" padding={1}>
                    <text style={{ fg: "red" }} attributes={TextAttributes.BOLD}>
                        ERRORS ({errors.length}): [Ctrl+R] to clear
                    </text>
                    {errors.slice(-3).map((errorEntry, i: number) => (
                        <text key={errorEntry.id} style={{ fg: errorEntry.error.color }}>
                            {i + 1}. {errorEntry.error.message}
                        </text>
                    ))}
                </box>
            )}

            <box marginTop={1} borderStyle="single" borderColor="grey" padding={1}>
                <text attributes={TextAttributes.DIM}>
                    [TAB] Switch View | [Q] Quit
                </text>
            </box>
        </box>
    );
}

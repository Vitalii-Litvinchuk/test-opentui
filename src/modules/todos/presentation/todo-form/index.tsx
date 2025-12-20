import { useState } from "react";
import { useTodoStore } from "../store/useTodoStore";
import { useRouterStore } from "../../../../components/router/store/useRouterStore";
import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { Routes } from "../../../../core/router/constants";

export function TodoForm() {
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const { addTodo, error } = useTodoStore();
    const { navigate } = useRouterStore();

    const handleSubmit = async () => {
        if (content.trim() && !isSaving) {
            setIsSaving(true);
            try {
                const result = await addTodo(content);
                if (result.isSuccess) {
                    navigate(Routes.HOME);
                }
            } finally {
                setIsSaving(false);
            }
        }
    };

    useKeyboard((key: { name: string }) => {
        if (key.name === "return") {
            handleSubmit();
        }
        if (key.name === "escape") {
            navigate(Routes.HOME);
        }
    });

    return (
        <box flexDirection="column" gap={1}>
            <text attributes={TextAttributes.BOLD}>Create New Task:</text>

            <box borderStyle="single" padding={1} borderColor={isSaving ? "grey" : "white"}>
                <input
                    focused={!isSaving}
                    onInput={(value: string) => {
                        setContent(value);
                    }}
                    placeholder="Type task here..."
                />
            </box>

            {error && (
                <text style={{ fg: error.color }} attributes={TextAttributes.BOLD}>
                    {error.message}
                </text>
            )}

            <box gap={2}>
                <text
                    onMouseDown={handleSubmit}
                    attributes={TextAttributes.BOLD}
                    style={{ fg: isSaving ? "grey" : "green" }}
                >
                    {isSaving ? "[ SAVING... ]" : "[ SAVE ]"}
                </text>
                <text
                    onMouseDown={() => navigate(Routes.HOME)}
                    style={{ fg: "red" }}
                >
                    [ CANCEL ]
                </text>
            </box>

            <box marginTop={1}>
                <text attributes={TextAttributes.DIM}>[ENTER] Save | [ESC] Cancel</text>
            </box>
        </box>
    );
}

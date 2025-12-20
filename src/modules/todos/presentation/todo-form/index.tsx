import { useEffect, useState } from "react";
import { useTodoStore } from "../store/useTodoStore";
import { useCategoryStore } from "../../../categories/presentation/store/useCategoryStore";
import { useRouterStore } from "../../../../components/router/store/useRouterStore";
import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { Routes } from "../../../../core/router/constants";
import type { Category } from "../../../categories/domain/schema";

export function TodoForm() {

    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [isSaving, setIsSaving] = useState(false);

    const { addTodo, error } = useTodoStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { navigate } = useRouterStore();

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (content.trim() && !isSaving) {
            setIsSaving(true);
            try {
                const result = await addTodo(content, categoryId);
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

            <box flexDirection="column">
                <text attributes={TextAttributes.BOLD}>Select Category (optional):</text>
                <box gap={1} marginTop={1} flexWrap="wrap">
                    <text
                        style={{ fg: categoryId === undefined ? "cyan" : "white" }}
                        onMouseDown={() => setCategoryId(undefined)}
                        attributes={categoryId === undefined ? TextAttributes.BOLD : TextAttributes.DIM}
                    >
                        [None]
                    </text>
                    {categories.map((cat: Category) => (
                        <text
                            key={cat.id}
                            style={{ fg: categoryId === cat.id ? "cyan" : "white" }}
                            onMouseDown={() => setCategoryId(cat.id)}
                            attributes={categoryId === cat.id ? TextAttributes.BOLD : TextAttributes.DIM}
                        >
                            [{cat.name}]
                        </text>
                    ))}
                </box>
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


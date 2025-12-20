import { useEffect, useState } from "react";
import { useTodoStore } from "../store/useTodoStore";
import { useCategoryStore } from "../../../categories/presentation/store/useCategoryStore";
import { useRouterStore } from "../../../../components/router/store/useRouterStore";
import { TextAttributes } from "@opentui/core";
import { Routes } from "../../../../core/router/constants";
import type { Category } from "../../../categories/domain/schema";
import { Focusable, FocusableList } from "../../../../components/focusable";

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

    const categoryOptions = [{ id: undefined, name: "None" } as any, ...categories];

    return (
        <box flexDirection="column" gap={1}>
            <text attributes={TextAttributes.BOLD}>Create New Task:</text>

            <Focusable id="todo-content-input">
                {(isFocused, isActive) => (
                    <box borderStyle="single" padding={1} borderColor={isFocused ? "cyan" : (isSaving ? "grey" : "white")}>
                        <input
                            focused={isActive && !isSaving}
                            onInput={(value: string) => {
                                setContent(value);
                            }}
                            placeholder="Type task here..."
                        />
                    </box>
                )}
            </Focusable>

            <box flexDirection="column">
                <text attributes={TextAttributes.BOLD}>Select Category (optional):</text>
                <FocusableList
                    items={categoryOptions}
                    visibleCount={3}
                    onItemAction={(item) => setCategoryId(item.id)}
                    renderItem={(cat, isSelected) => (
                        <text
                            style={{
                                fg: categoryId === cat.id ? "cyan" : "white",
                                bg: isSelected ? "white" : "transparent"
                            }}
                            attributes={categoryId === cat.id ? TextAttributes.BOLD : TextAttributes.DIM}
                        >
                            {isSelected ? "> " : "  "}[{cat.name}]
                        </text>
                    )}
                />
            </box>

            {error && (
                <text style={{ fg: error.color }} attributes={TextAttributes.BOLD}>
                    {error.message}
                </text>
            )}

            <box gap={2}>
                <Focusable onAction={handleSubmit}>
                    {(isFocused) => (
                        <text
                            attributes={TextAttributes.BOLD}
                            style={{
                                fg: isFocused ? "black" : (isSaving ? "grey" : "green"),
                                bg: isFocused ? "green" : "transparent"
                            }}
                        >
                            {isSaving ? "[ SAVING... ]" : "[ SAVE ]"}
                        </text>
                    )}
                </Focusable>
                <Focusable onAction={() => navigate(Routes.HOME)}>
                    {(isFocused) => (
                        <text
                            style={{
                                fg: isFocused ? "black" : "red",
                                bg: isFocused ? "red" : "transparent"
                            }}
                        >
                            [ CANCEL ]
                        </text>
                    )}
                </Focusable>
            </box>

            <box marginTop={1}>
                <text attributes={TextAttributes.DIM}>[ARROWS] Select | [SPACE] Focus/Action | [ESC] Cancel</text>
            </box>
        </box>
    );
}


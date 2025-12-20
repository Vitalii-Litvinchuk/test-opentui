import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { useCategoryStore } from "../store/useCategoryStore";
import { useRouterStore } from "../../../../components/router/store/useRouterStore";
import { Routes } from "../../../../core/router/constants";
import { Focusable } from "../../../../components/focusable";


export function CategoryForm() {
    const [name, setName] = useState("");
    const { addCategory, error } = useCategoryStore();
    const { navigate } = useRouterStore();

    const handleSubmit = async () => {
        const result = await addCategory(name);
        if (result.isSuccess) {
            navigate(Routes.CATEGORIES.LIST);
        }
    };


    return (
        <box flexDirection="column">
            <text attributes={TextAttributes.BOLD}>Create New Category:</text>

            <Focusable id="category-name-input">
                {(isFocused, isActive) => (
                    <box marginTop={1} borderStyle="single" borderColor={isFocused ? "cyan" : "blue"} padding={1}>
                        <input
                            focused={isActive}
                            onInput={(value: string) => {
                                setName(value);
                            }}
                            placeholder="Type category name..."
                        />
                    </box>
                )}
            </Focusable>

            {error && (
                <text marginTop={1} style={{ fg: "red" }}>{error.message}</text>
            )}

            <box marginTop={1} gap={2}>
                <Focusable onAction={handleSubmit}>
                    {(isFocused) => (
                        <text
                            style={{ fg: isFocused ? "black" : "green", bg: isFocused ? "green" : "transparent" }}
                            attributes={TextAttributes.BOLD}
                        >
                            [ SAVE ]
                        </text>
                    )}
                </Focusable>

                <Focusable onAction={() => navigate(Routes.HOME)}>
                    {(isFocused) => (
                        <text
                            style={{ fg: isFocused ? "black" : "red", bg: isFocused ? "red" : "transparent" }}
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

import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { useCategoryStore } from "../store/useCategoryStore";
import { useRouterStore } from "../../../../components/router/store/useRouterStore";
import { Routes } from "../../../../core/router/constants";


export function CategoryForm() {
    const [name, setName] = useState("");
    const { addCategory, error } = useCategoryStore();
    const { navigate } = useRouterStore();

    useKeyboard((key: { name: string }) => {
        if (key.name === "return") {
            handleSubmit();
        }
        if (key.name === "escape") {
            navigate(Routes.HOME);
        }
    });

    const handleSubmit = async () => {
        const result = await addCategory(name);
        if (result.isSuccess) {
            navigate(Routes.CATEGORIES.LIST);
        }
    };


    return (
        <box flexDirection="column">
            <text attributes={TextAttributes.BOLD}>Create New Category:</text>

            <box marginTop={1} borderStyle="single" borderColor="blue" padding={1}>
                <input
                    focused={true}
                    onInput={(value: string) => {
                        setName(value);
                    }}
                    placeholder="Type category name..."
                />
            </box>

            {error && (
                <text marginTop={1} style={{ fg: "red" }}>{error.message}</text>
            )}

            <box marginTop={1}>
                <text attributes={TextAttributes.DIM}>[RETURN] Save | [ESC] Cancel</text>
            </box>
        </box>
    );
}

import { useKeyboard } from "@opentui/react";
import { useState } from "react";

export type View = 'home' | 'about';

export function useNavigation() {
    const [currentView, setView] = useState<View>('home');

    useKeyboard((key: { name: string }) => {
        if (key.name === "tab") {
            setView((prev) => prev === 'home' ? 'about' : 'home');
        }
        if (key.name === "q") {
            process.exit(0);
        }
    });

    return { currentView, setView };
}

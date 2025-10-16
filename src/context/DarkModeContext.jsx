import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
    // window.matchMedia("(prefers-color-scheme: dark)").matches returns true if
    // dark mode is enabled on Microsoft Windows Personalization settings
    // So we can load the application first time according to dark mode setting of our PC
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(
        window.matchMedia("(prefers-color-scheme: dark)").matches,
        "isDarkMode"
    );

    useEffect(
        function () {
            if (isDarkMode) {
                // "documentElement" refer to the root node which is <html> tag,
                // this is the place where we need to place the dark mode class
                // as all color styles are defined at root <html> tag
                document.documentElement.classList.add("dark-mode");
                document.documentElement.classList.remove("light-mode");
            } else {
                document.documentElement.classList.add("light-mode");
                document.documentElement.classList.remove("dark-mode");
            }
        },
        [isDarkMode]
    );

    function toggleDarkMode() {
        setIsDarkMode((isDark) => !isDark);
    }

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined)
        throw new Error(
            "Dark mode context was used outside of DarkModePrivider"
        );
    return context;
}

export { DarkModeProvider, useDarkMode };

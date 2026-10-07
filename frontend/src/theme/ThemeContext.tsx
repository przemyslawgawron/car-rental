import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { createAppTheme } from "./theme";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
    mode: ThemeMode;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
    children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [mode, setMode] = useState<ThemeMode>("dark");

    const toggleTheme = () => {
        setMode((currentMode) =>
            currentMode === "light" ? "dark" : "light"
        );
    };

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    const contextValue = useMemo(
        () => ({
            mode,
            toggleTheme,
        }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useThemeMode() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useThemeMode must be used within ThemeProvider");
    }

    return context;
}
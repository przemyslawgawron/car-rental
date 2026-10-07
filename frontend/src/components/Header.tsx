import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useThemeMode } from "../theme/ThemeContext";

function Header() {
    const { mode, toggleTheme } = useThemeMode();

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box sx={{ width: 40 }} />

                <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        textAlign: "center",
                    }}
                >
                    Car Rental
                </Typography>

                <IconButton
                    color="inherit"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${
                        mode === "light" ? "dark" : "light"
                    } mode`}
                >
                    {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
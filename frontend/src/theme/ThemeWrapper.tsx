import { ThemeProvider } from "@mui/material";
import { BaseTheme } from "./theme";

interface ThemeWrapperProps {
    children: React.ReactNode;
};

const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
    return (
        <ThemeProvider theme={BaseTheme}>
            {children}
        </ThemeProvider>
    );
};

export default ThemeWrapper;
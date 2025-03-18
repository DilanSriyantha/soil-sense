import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { Outlet } from "react-router";
import Footer from "./Footer";

interface BaseLayoutProps {
    children?: ReactNode;
};

const BaseLayout: React.FC<BaseLayoutProps> = () => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                overflow: "auto",
            }}
        >
            <ResponsiveAppBar />
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 5,
                    display: 'block',
                    flex: 1,
                    mb: 2
                }}
            >
                <Outlet />
            </Box>
            <Footer />
        </Box>
    );
}

export default BaseLayout;
import { FacebookSharp, GitHub, LinkedIn, LocationOn, Mail, Phone, Twitter } from "@mui/icons-material";
import { Box, Grid2, IconButton, Stack, Typography, useTheme } from "@mui/material";

function Footer() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "relative",
                display: "block",
                zIndex: 5,
                flex: .1,
                padding: 2,
                bgcolor: theme.palette.primary.dark,
                color: "#fff"
            }}
        >
            <Grid2 container size={12}>
                <Grid2 size={6}>
                    <Stack direction={"column"} gap={1}>
                        <Stack direction={"row"} gap={1}>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 100,
                                    padding: .5
                                }}
                            >
                                <LocationOn />
                            </Box>
                            <Typography variant="body1" sx={{ textAlign: "start" }}>No,<br/>Address Line #1,<br/>Address Line #2</Typography>
                        </Stack>
                        <Stack direction={"row"} gap={1}>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 100,
                                    padding: .5
                                }}
                            >
                                <Phone />
                            </Box>
                            <Typography variant="body1">+94 7x xxx xxxx</Typography>
                        </Stack>
                        <Stack direction={"row"} gap={1}>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 100,
                                    padding: .5
                                }}
                            >
                                <Mail />
                            </Box>
                            <Typography variant="body1">johndoe@jd.com</Typography>
                        </Stack>
                    </Stack>
                </Grid2>
                <Grid2 size={6} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} >
                    <Stack direction={"column"} gap={1}>
                        <Typography variant="h6">About the company</Typography>
                        <Typography variant="subtitle2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia corrupti nam facere fuga facilis quibusdam rerum sit incidunt repellendus a?</Typography>
                    </Stack>
                    <Stack direction={"row"} gap={1} pt={1}>
                        <IconButton
                            sx={{
                                color: "#fff",
                                bgcolor: theme.palette.primary.main,
                                borderRadius: 2
                            }}
                        >
                            <FacebookSharp />
                        </IconButton>
                        <IconButton
                            sx={{
                                color: "#fff",
                                bgcolor: theme.palette.primary.main,
                                borderRadius: 2
                            }}
                        >
                            <Twitter />
                        </IconButton>
                        <IconButton
                            sx={{
                                color: "#fff",
                                bgcolor: theme.palette.primary.main,
                                borderRadius: 2
                            }}
                        >
                            <LinkedIn />
                        </IconButton>
                        <IconButton
                            sx={{
                                color: "#fff",
                                bgcolor: theme.palette.primary.main,
                                borderRadius: 2
                            }}
                        >
                            <GitHub />
                        </IconButton>
                    </Stack>
                </Grid2>
            </Grid2>
        </Box>
    );
}

export default Footer;
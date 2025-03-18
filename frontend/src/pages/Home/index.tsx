import { Card, CardContent, Container, Grid2, Typography } from "@mui/material";
import GMap from "../../components/GMap";

function Home() {
    return (
        <Container sx={{ mt: 2 }}>
            <Grid2 container spacing={2}>
                <Grid2 size={{ sm: 12, md: 8 }}>
                    <Card>
                        <GMap />
                    </Card>
                </Grid2>
                <Grid2 size={{ sm: 12, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography color="inherit" variant="subtitle2" component="div">Information</Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    );
}

export default Home;
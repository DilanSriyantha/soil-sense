import { Card, CardContent, Container, Grid2, Stack, Typography } from "@mui/material";
import GMap, { Marker, SecondaryMarker } from "../../components/GMap";
import { useCallback, useState } from "react";
import MarkerInformation from "../../components/MarkerInformation";

function Home() {
    const [markers, setMarker] = useState<Marker[]>([]);
    const [secondaryMarkers, setSecondaryMarkers] = useState<SecondaryMarker[]>([]);

    const handleSetMarker = useCallback((marker: Marker) => {
        setMarker((current) => [
            ...current,
            marker
        ]);
    }, [markers]);

    const handleRemoveMarker = useCallback((marker: Marker) => {
        marker.rectangle.setMap(null);
        setMarker(markers.filter(m => m.id !== marker.id));
    }, [markers]);

    const handleSetNearbyMarkers = useCallback((markers: SecondaryMarker[]) => {
        setSecondaryMarkers(markers);
    }, []);

    const handleSecondaryMarkerClick = useCallback((marker: Marker) => {
        setSecondaryMarkers((current) => current.filter((m) => m.id !== marker.id));
        setMarker((current) => [...current, marker]);
    }, [markers, secondaryMarkers]);

    return (
        <Container sx={{ mt: 2 }}>
            <Stack direction={"column"} gap={1}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ sm: 12, md: markers.length > 0 ? 8 : 12 }}>
                        <Card>
                            <GMap markers={markers} secondaryMarkers={secondaryMarkers} setMarker={handleSetMarker} onSecondaryMarkerClick={handleSecondaryMarkerClick} />
                        </Card>
                    </Grid2>
                    <Grid2 size={{ sm: 12, md: markers.length > 0 ? 4 : 0 }}>
                        <Card sx={{ height: "100%", maxHeight: "100vh", overflow: "auto", pt: 7 }}>
                            <Typography color="inherit" variant="subtitle2" component="div">Markers</Typography>
                            <CardContent>
                                <Stack direction={"column"} gap={2}>
                                    {
                                        markers.map((marker, idx) => (
                                            <div key={idx}>
                                                <MarkerInformation 
                                                    index={idx}
                                                    onSetNearbyMarkers={handleSetNearbyMarkers}
                                                    onRemoveClick={() => handleRemoveMarker(marker)}
                                                    lat={marker.latLng.lat}
                                                    lng={marker.latLng.lng}
                                                    range="10m"
                                                />
                                            </div>
                                        ))
                                    }
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            </Stack>
        </Container>
    );
}

export default Home;
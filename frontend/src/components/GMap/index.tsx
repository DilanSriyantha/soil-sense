import { CompassCalibration, LocationOn, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Grid2, IconButton } from "@mui/material";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MouseEvent, useState } from "react";

export interface LatLng {
    lattitude: number;
    longitude: number;
};

interface GMapProps {
    onLocationSelected?: (latlng: LatLng) => void;  
};

function GMap({ onLocationSelected }: GMapProps) {
    const [zoom, setZoom] = useState<number>(3);


    function handleZoomInClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
        setZoom(prev => prev+1);
    }

    function handleZoomOutClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
        setZoom(prev => prev-1);
    }

    return (
        <>
            <Grid2 size={12} sx={{ p: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Grid2 size={3}>
                    <IconButton sx={{ display: "flex", flex: 1, borderRadius: 1, width: "100%" }} onClick={handleZoomInClick}>
                        <ZoomIn />
                    </IconButton>
                </Grid2>
                <Grid2 size={3}>
                    <IconButton sx={{ display: "flex", flex: 1, borderRadius: 1, width: "100%" }} onClick={handleZoomOutClick}>
                        <ZoomOut />
                    </IconButton>
                </Grid2>
                <Grid2 size={3}>
                    <IconButton sx={{ display: "flex", flex: 1, borderRadius: 1, width: "100%" }}>
                        <LocationOn />
                    </IconButton>
                </Grid2>
                <Grid2 size={3}>
                    <IconButton sx={{ display: "flex", flex: 1, borderRadius: 1, width: "100%" }}>
                        <CompassCalibration />
                    </IconButton>
                </Grid2>
            </Grid2>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                    style={{ width: "100vw", height: "100vh" }}
                    defaultCenter={{
                        lat: 6.9271, lng: 79.8612
                    }}
                    defaultZoom={30}
                    zoom={zoom}
                    mapTypeId={"terrain"}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                />
            </APIProvider>
        </>
    );
}

export default GMap;
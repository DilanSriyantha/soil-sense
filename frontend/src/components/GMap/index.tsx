import { CompassCalibration, LocationOn, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Grid2, IconButton } from "@mui/material";
import { APIProvider, Map, MapCameraChangedEvent, MapMouseEvent, Marker } from "@vis.gl/react-google-maps";
import React, { MouseEvent, useState } from "react";
import { useDrawingManager } from "./DrawingManager";

interface GMapProps {
    onLocationSelected?: (latlng: google.maps.LatLngLiteral) => void;  
};

function GMap({ onLocationSelected }: GMapProps) {
    const [zoom, setZoom] = useState<number>(15);
    const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
    
    const drawingManager = useDrawingManager();

    function handleZoomInClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
        setZoom(prev => prev+1);
    }

    function handleZoomOutClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
        setZoom(prev => prev-1);
    }

    function handleMapClick(event: MapMouseEvent): void {
        if(!event.detail.latLng || event.detail.latLng === null) return;
        const latlng = event.detail.latLng;
        setMarkers((current) => [
            ...current,
            latlng
        ]);
    }

    function handleZoomChange(event: MapCameraChangedEvent): void {
        setZoom(event.detail.zoom);
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
                    defaultZoom={15}
                    zoom={zoom}
                    mapTypeId={"terrain"}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    onClick={handleMapClick}
                    onZoomChanged={handleZoomChange}
                >
                    {markers.map((marker) => (
                        <Marker
                            position={{
                                lat: marker.lat,
                                lng: marker.lng
                            }}
                        />
                    ))}
                </Map>
            </APIProvider>
        </>
    );
}

export default GMap;
import { CompassCalibration, LocationOn, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Grid2, IconButton } from "@mui/material";
import { Map, MapCameraChangedEvent, MapMouseEvent, Marker, useMap } from "@vis.gl/react-google-maps";
import { MouseEvent, useState } from "react";

export interface Marker {
    id: number,
    latLng: google.maps.LatLngLiteral;
    rectangle: google.maps.Rectangle;
}

interface GMapProps {
    markers?: Marker[];
    setMarker?: (marker: Marker) => void;
};

function GMap({ markers, setMarker }: GMapProps) {
    const [zoom, setZoom] = useState<number>(12);

    const map = useMap();

    function handleZoomInClick(): void {
        setZoom(prev => prev + 1);
    }

    function handleZoomOutClick(): void {
        setZoom(prev => prev - 1);
    }

    function handleMapClick(event: MapMouseEvent): void {
        if (!event.detail.latLng || event.detail.latLng === null) return;

        const latlng = event.detail.latLng;

        if (setMarker){
            const rect = calculateBoundingBox(latlng.lat, latlng.lng);
            rect.setMap(map);
            setMarker({id: Math.random(), latLng: latlng, rectangle: rect});
        }
    }

    function handleZoomChange(event: MapCameraChangedEvent): void {
        setZoom(event.detail.zoom);
    }

    function calculateBoundingBox(lat: number, lng: number, radiusKm: number = 10) {
        const latDiff = radiusKm / 111.32;
        const lonDiff = radiusKm / (111.32 * Math.cos(lat * Math.PI / 180));

        const rect = new google.maps.Rectangle({
            bounds: {
                north: lat + latDiff,
                south: lat - latDiff,
                east: lng + lonDiff,
                west: lng - lonDiff
            },
            strokeColor: "#ff0000",
            strokeWeight: 2,
            fillColor: "#ff0000",
            fillOpacity: .2
        });

        return rect;
    };

    return (
        <>
            <Grid2 size={12} sx={{ p: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
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
                {markers && markers.map((marker, idx) => (
                    <Marker
                        key={idx}
                        position={{
                            lat: marker.latLng.lat,
                            lng: marker.latLng.lng
                        }}
                    />
                ))}
            </Map>
        </>
    );
}

export default GMap;
import { Box, Card, CardContent, Container, Divider, Grid2, IconButton, Stack, Typography } from "@mui/material";
import GMap, { Marker } from "../../components/GMap";
import { useCallback, useState } from "react";
import { Close } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useApi } from "../../hooks/useApi";

interface DataRow {
    id: number;
    lat: number;
    lng: number;
    loc: string;
    water_table: number;
    bed_rock_level: number;
    depth_range: string;
    description: string;
};

const columns: GridColDef<DataRow>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "lat", headerName: "Lattitude", width: 150 },
    { field: "lng", headerName: "Longitude", width: 150 },
    { field: "loc", headerName: "Location", width: 150 },
    { field: "water_table", headerName: "Water Table", width: 90 },
    { field: "bed_rock_level", headerName: "Bed Rock Level", width: 90 },
    { field: "depth_range", headerName: "Depth Range", width: 150 }, 
    { field: "description", headerName: "Description", width: 150 }
];

function Home() {
    const [markers, setMarker] = useState<Marker[]>([]);
    const [rows, setRows] = useState<DataRow[]>([]);

    const api = useApi();

    const handleSetMarker = useCallback((marker: Marker) => {
        setMarker((current) => [
            ...current,
            marker
        ]);

        fetchInformation(marker);
    }, [markers]);

    const handleRemoveMarker = useCallback((marker: Marker) => {
        marker.rectangle.setMap(null);
        setMarker(markers.filter(m => m.id !== marker.id));
    }, [markers]);

    const fetchInformation = useCallback(async(marker: Marker) => {
        try{
            const res = await api.get<DataRow[]>("/getData", {
                lat: `${marker.latLng.lat}`,
                lng: `${marker.latLng.lng}`
            });
            
            if(res)
                setRows(res);
        }catch(err){
            console.log(err instanceof Error ? err.message : "Unknown error.");
        }
    }, [markers, rows]);    

    return (
        <Container sx={{ mt: 2 }}>
            <Stack direction={"column"} gap={1}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ sm: 12, md: markers.length > 0 ? 8 : 12 }}>
                        <Card>
                            <GMap markers={markers} setMarker={handleSetMarker} />
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
                                                <Stack direction={"column"} gap={2} textAlign={"start"}>
                                                    <Stack direction={"row"} gap={2} alignItems={"center"}>
                                                        <Typography variant="subtitle2">Marker #{idx + 1}</Typography>
                                                        <IconButton
                                                            onClick={(e) => handleRemoveMarker(marker)}
                                                        >
                                                            <Close />
                                                        </IconButton>
                                                    </Stack>
                                                    <Box>
                                                        <Typography variant="body1">Lattitude: {marker.latLng.lat}</Typography>
                                                        <Typography variant="body1">Longitude: {marker.latLng.lng}</Typography>
                                                        <Typography variant="body1">Range: 10Km</Typography>
                                                    </Box>
                                                </Stack>
                                                {idx !== markers.length - 1 && <Divider />}
                                            </div>
                                        ))
                                    }
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
                {
                    markers.length > 0
                    &&
                    <Card>
                        <Box
                            sx={{ p: 2 }}
                        >
                            <Typography color="inherit" variant="subtitle2" component="div">Information</Typography>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 10,
                                        },
                                    },
                                }}
                                pageSizeOptions={[10, 50, 100]}
                                checkboxSelection
                                disableRowSelectionOnClick
                            />
                        </Box>
                    </Card>
                }
            </Stack>
        </Container>
    );
}

export default Home;
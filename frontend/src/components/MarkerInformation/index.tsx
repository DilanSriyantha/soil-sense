import { Close, ExpandMore } from "@mui/icons-material";
import { Card, Stack, Typography, IconButton, Box, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useApi } from "../../hooks/useApi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { SecondaryMarker } from "../GMap";
import { BHInfo } from "../BHInputPanel";

interface MarkerInformationProps {
    onRemoveClick: () => void;
    onSetNearbyMarkers: (markers: SecondaryMarker[]) => void;
    index: number;
    lat: number;
    lng: number;
    range: string;
};

export interface SoilProperty {
    id: number;
    depth_range: string;
    description: string;
};

interface Result {
    lat: number;
    lng: number;
    loc: string;
    water_table: number;
    bed_rock_level: number;
    bh_info: BHInfo[];
};

const columns: GridColDef<SoilProperty>[] = [
    { field: "depth_range", headerName: "Depth Range", width: 100 },
    { field: "description", headerName: "Description", width: 500 }
];

export default function MarkerInformation(props: MarkerInformationProps) {
    const [result, setResult] = useState<Result>();

    const api = useApi();

    useEffect(() => {
        fetchInformation();
    }, []);

    async function fetchInformation() {
        try{
            const res = await api.get<Result>("/getData", {
                lat: `${props.lat}`,
                lng: `${props.lng}`
            });

            setResult(res);
        }catch(err) {
            console.log(err instanceof Error ? err.message : "Unknown error.");
        }
    }

    async function fetchNearbyMarkers() {
        try{
            const res = await api.get<Result[]>("/getNearbyData", {
                lat: `${props.lat}`,
                lng: `${props.lng}`
            });

            if(!res)
                throw new Error("Something went wrong.");

            const markers: SecondaryMarker[] = res.map(m => {
                return {
                    id: Math.random(),
                    latLng: { lat: m.lat, lng: m.lng }
                };
            });

            props.onSetNearbyMarkers(markers);
        }catch(err) {
            console.log(err instanceof Error ? err.message : "Unknown error.");
        }
    }

    function handleFindNearbyClick() {
        fetchNearbyMarkers();
    }

    return (
        <Card sx={{ p: 1 }}>
            <Stack direction={"column"} gap={2} textAlign={"start"}>
                <Stack direction={"row"} gap={2} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="subtitle2">Marker #{props.index+1}</Typography>
                    <IconButton
                        onClick={props.onRemoveClick}
                    >
                        <Close />
                    </IconButton>
                </Stack>
                <Stack>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography variant="body1">Lattitude</Typography>
                        <Typography variant="body1">{props.lat}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography variant="body1">Longitude</Typography>
                        <Typography variant="body1">{props.lng}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography variant="body1">Range</Typography>
                        <Typography variant="body1">{props.range}</Typography>
                    </Box>
                    {
                        result && JSON.stringify(result) !== "{}"
                        ?
                            <>
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Typography variant="body1">Location</Typography>
                                    <Typography variant="body1">{result.loc}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Typography variant="body1">Bed Rock Level</Typography>
                                    <Typography variant="body1">{result.bed_rock_level}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Typography variant="body1">Water Table</Typography>
                                    <Typography variant="body1">{result.water_table}</Typography>
                                </Box>
                                <Box sx={{ p: 2 }}>
                                    <div>
                                        {result.bh_info && result.bh_info.map((bhi, idx) => (
                                            <Accordion key={idx}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMore />}
                                                    aria-controls={`panel${bhi.number}-content`}
                                                    id={`panel${bhi.number}-header`}
                                                >
                                                    <Typography component="span">BH {bhi.number}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Box sx={{ display: "flex" }}>
                                                        <DataGrid
                                                            rows={bhi.soil_properties}
                                                            columns={columns}
                                                            disableRowSelectionOnClick
                                                            autoPageSize
                                                        />
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </div>
                                    
                                </Box>
                            </>
                        :
                            <Box sx={{ p: 1, display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                                <Typography textAlign="center" variant="subtitle2">No information found.</Typography>
                                <Button variant="outlined" onClick={handleFindNearbyClick}>Find Nearby Locations</Button>
                            </Box>
                    }
                </Stack>
            </Stack>
        </Card>
    );
}
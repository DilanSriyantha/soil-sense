import { Box, Button, Card, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import SoilPropertyInput, { SoilPropertyInputHandle } from "../../components/SoilPropertyInput";
import { useCallback, useReducer, useRef, useState } from "react";
import { SoilProperty } from "../../components/MarkerInformation";
import { useApi } from "../../hooks/useApi";

interface InsertDataState {
    latitude: number;
    longitude: number;
    location: string;
    water_table: number;
    bed_rock_level: number;
};

export interface SoilInfomation {
    latitude: number;
    longitude: number;
    location: string;
    water_table: number;
    bed_rock_level: number;
    soil_properties: SoilProperty[];
};

enum ActionType {
    CHANGE_LAT,
    CHANGE_LNG,
    CHANGE_LOCATION,
    CHANGE_WATER_TABLE,
    CHANGE_BED_ROCK_LEVEL,
    CLEAR_ALL,
};

const initialState: InsertDataState = {
    latitude: 0,
    longitude: 0,
    location: "",
    water_table: 0,
    bed_rock_level: 0,
};

const reducer = (state: InsertDataState, action: { type: ActionType, payload: any }): InsertDataState => {
    switch(action.type) {
        case ActionType.CHANGE_LAT:
            return { ...state, latitude: action.payload };
        case ActionType.CHANGE_LNG:
            return { ...state, longitude: action.payload };
        case ActionType.CHANGE_LOCATION:
            return { ...state, location: action.payload };
        case ActionType.CHANGE_WATER_TABLE:
            return { ...state, water_table: action.payload };
        case ActionType.CHANGE_BED_ROCK_LEVEL:
            return { ...state, bed_rock_level: action.payload };
        case ActionType.CLEAR_ALL:
            return initialState;
        default: 
            return state;
    }
};

export default function InsertData() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const[loading, setLoading] = useState<boolean>(false);

    const soilPropertyInputRef = useRef<SoilPropertyInputHandle>(null);

    const api = useApi();

    const handleCLear = useCallback(() => {
        dispatch({ type: ActionType.CLEAR_ALL, payload: null });

        if(soilPropertyInputRef.current)
            soilPropertyInputRef.current.clear();
    }, []);

    function handleSubmit() {
        if(!soilPropertyInputRef.current) return;

        insertNewRecord();
    };

    async function insertNewRecord() {
        try{
            if(!soilPropertyInputRef.current) return;

            const newEntry: SoilInfomation = {
                ...state,
                soil_properties: soilPropertyInputRef.current.getRows()
            };

            const res = await api.post("/insert", newEntry);
            if(!res)
                throw new Error("Something went wrong!");

            console.log(res);
        }catch(err) {
            console.log(err instanceof Error ? err.message : "Unknown error.");
        }
    }

    return (
        <Container>
            <Card sx={{ mt: 2 }}>
                <Typography sx={{ p: 1, fontWeight: "600" }} textAlign="start" variant="body2">Insert New Entry</Typography>
                <Divider />
                <Stack sx={{ p: 1 }} gap={1}>
                    <TextField variant="outlined" label="Latitude" name="latitude" type="number" value={state.latitude} onChange={(e) => dispatch({ type: ActionType.CHANGE_LAT, payload: e.target.value })} />
                    <TextField variant="outlined" label="Longitude" name="longitude" type="number" value={state.longitude} onChange={(e) => dispatch({ type: ActionType.CHANGE_LNG, payload: e.target.value })} />
                    <TextField variant="outlined" label="Location" name="location" type="text" value={state.location} onChange={(e) => dispatch({ type: ActionType.CHANGE_LOCATION, payload: e.target.value })} />
                    <TextField variant="outlined" label="Water Table" name="water_table" type="number" value={state.water_table} onChange={(e) => dispatch({ type: ActionType.CHANGE_WATER_TABLE, payload: e.target.value })} />
                    <TextField variant="outlined" label="Bed Rock Level" name="bed_rock_level" type="number" value={state.bed_rock_level} onChange={(e) => dispatch({ type: ActionType.CHANGE_BED_ROCK_LEVEL, payload: e.target.value })} />
                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "start", pt: 2 }}>
                        <Typography variant="body2" sx={{ pb: 1 }}>Soil Properties</Typography>
                        <SoilPropertyInput ref={soilPropertyInputRef} />
                    </Box>
                </Stack>
                <Divider />
                <Stack gap={1} direction={"row"} justifyContent={"flex-end"} sx={{ p: 1 }}>
                    <Button variant="outlined" onClick={handleCLear}>Clear</Button>
                    <Button variant="contained" onClick={handleSubmit} loading={loading} loadingPosition="start">Submit</Button>
                </Stack>
            </Card>
        </Container>
    );
}
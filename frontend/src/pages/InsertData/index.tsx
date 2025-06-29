import { Box, Button, Card, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useReducer, useRef, useState } from "react";
import { SoilProperty } from "../../components/MarkerInformation";
import { useApi } from "../../hooks/useApi";
import BHInputPanel, { BHInfo, BHInputPanelHandle } from "../../components/BHInputPanel";
import { useAlert } from "../../hooks/useAlert";

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
    bh_info: BHInfo[];
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
    const [loading, setLoading] = useState<boolean>(false);

    const BHInputPanelRef = useRef<BHInputPanelHandle>(null);

    const alert = useAlert();
    const api = useApi();

    const handleCLear = useCallback(() => {
        dispatch({ type: ActionType.CLEAR_ALL, payload: null });

        if(BHInputPanelRef.current === null) return;

        BHInputPanelRef.current.clearAll();
    }, []);

    function handleSubmit() {
        if(!BHInputPanelRef.current) return;

        insertNewRecord();
    };

    async function insertNewRecord() {
        if(BHInputPanelRef.current === null) return;

        setLoading(true);

        const soilInfo: SoilInfomation = {
            ...state,
            bh_info: BHInputPanelRef.current.getBHInformation(),
        };

        console.log(soilInfo);

        try{
            const res = await api.post("/insert", soilInfo);

            if(!res)
                throw new Error("Something went wrong");

            console.log(res);

            setTimeout(() => {
                alert.showSuccess(res.message);
                setLoading(false);
            }, 1000);
        }catch(err){
            console.log(err instanceof Error ? err.message : "Unknown error.");
            setTimeout(() => {
                console.log(err instanceof Error ? err.message : "Unknown error.");
                setLoading(false);
            }, 1000);
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
                        <BHInputPanel ref={BHInputPanelRef} />
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
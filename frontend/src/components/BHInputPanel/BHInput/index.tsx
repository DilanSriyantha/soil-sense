import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridCallbackDetails, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useEffect, useReducer } from "react";
import { ExpandMore } from "@mui/icons-material";
import { SoilProperty } from "../../MarkerInformation";
import { BHInfo } from "..";

interface BHInputProps {
    bhInfo: BHInfo;
    onDelete: () => void;
    onAddSoilProp: (bhNumber: number, soilProp: SoilProperty) => void;
    onUpdateSoilProp: (bhNumber: number, spId: number, newData: SoilProperty) => void;
    onRemoveSoilProp: (bhNumber: number, spId: number) => void;
};

interface BHInputState {
    rows: SoilProperty[];
    depthRange: string;
    description: string;
    selectedId: number;
};

const initialState: BHInputState = {
    rows: [],
    depthRange: "",
    description: "",
    selectedId: -1,
};

enum ActionType {
    CHANGE_DEPTH_RANGE,
    CHANGE_DESCRIPTION,
    CHANGE_INPUT_FIELDS,
    CHANGE_SELECTED_ROW_IDX,
    ADD_ROW,
    UPDATE_ROW,
    DELETE_ROW,
    CLEAR_INPUT_FIELDS,
    CLEAR_ALL,
};

const reducer = (state: BHInputState, action: { type: ActionType, payload: any }): BHInputState => {
    switch(action.type) {
        case ActionType.CHANGE_DEPTH_RANGE:
            return { ...state, depthRange: action.payload };
        case ActionType.CHANGE_DESCRIPTION:
            return { ...state, description: action.payload };
        case ActionType.CHANGE_INPUT_FIELDS:
            return { ...state, depthRange: action.payload.depthRange, description: action.payload.description };
        case ActionType.CHANGE_SELECTED_ROW_IDX:
            return { ...state, selectedId: action.payload };
        case ActionType.ADD_ROW:
            return { ...state, rows: [...state.rows, action.payload], depthRange: "", description: "" };
        case ActionType.UPDATE_ROW:
            return { ...state, rows: state.rows.map((r) => {
                if(r.id == state.selectedId) {
                    r.depth_range = state.depthRange;
                    r.description = state.description;
                }
                return r;
            })};
        case ActionType.DELETE_ROW:
            return { ...state, rows: state.rows.filter((r) => r.id !== state.selectedId) };
        case ActionType.CLEAR_INPUT_FIELDS:
            return { ...state, depthRange: "", description: "" };
        case ActionType.CLEAR_ALL:
            return initialState;
        default:
            return state;
    }
};

const columns: GridColDef<SoilProperty>[] = [
    { field: "depth_range", headerName: "Depth Range", width: 100 },
    { field: "description", headerName: "Description", width: 500 }
];

export default function BHInput(props: BHInputProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if(state.selectedId < 0) return;

        const sp = props.bhInfo.soil_properties.find(s => s.id === state.selectedId);

        if(!sp) return;

        dispatch({ type: ActionType.CHANGE_INPUT_FIELDS, payload: { depthRange: sp.depth_range, description: sp.description } });
    }, [state.selectedId]);

    const setDepthRange = useCallback((value: string) => {
        dispatch({ type: ActionType.CHANGE_DEPTH_RANGE, payload: value });
    }, []);

    const setDescription = useCallback((value: string) => {
        dispatch({ type: ActionType.CHANGE_DESCRIPTION, payload: value });
    }, []);

    const handleRowSelection = useCallback((rowSelectionModel: GridRowSelectionModel, _details: GridCallbackDetails<any>): void => {
        let selectedId = rowSelectionModel[0];

        if(!rowSelectionModel[0])
            selectedId = -1;

        console.log(selectedId);

        dispatch({ type: ActionType.CHANGE_SELECTED_ROW_IDX, payload: selectedId });
    }, []);

    const handleAddRow = useCallback(() => {
        if(state.depthRange.length < 1 && state.description.length < 1) return;

        // dispatch({ type: ActionType.ADD_ROW, payload: { id: Math.random(), depth_range: state.depthRange, description: state.description } });
        props.onAddSoilProp(props.bhInfo.number, { id: Math.random(), depth_range: state.depthRange, description: state.description });
        dispatch({ type: ActionType.CLEAR_INPUT_FIELDS, payload: null });
    }, [state.depthRange && state.description]);

    const handleRemoveRow = useCallback(() => {
        // dispatch({ type: ActionType.DELETE_ROW, payload: null });
        props.onRemoveSoilProp(props.bhInfo.number, state.selectedId);
    }, [state.selectedId]);

    const handleUpdateRow = useCallback(() => {
        // dispatch({ type: ActionType.UPDATE_ROW, payload: null });
        props.onUpdateSoilProp(props.bhInfo.number, state.selectedId, { id: state.selectedId, depth_range: state.depthRange, description: state.description });
    }, [state.depthRange, state.description, state.selectedId]);

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`panel${props.bhInfo.number}-content`}
                id={`panel${props.bhInfo.number}-header`}
            >
                <Typography component="span">BH {props.bhInfo.number}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body1">Soil Properties</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ flex: "1 1 100%", minWidth: "300px", "@media (min-width: 600px)": { flex: 2, } }}>
                        <DataGrid
                            rows={props.bhInfo.soil_properties}
                            columns={columns}
                            checkboxSelection
                            disableMultipleRowSelection
                            onRowSelectionModelChange={handleRowSelection}
                        />
                    </Box>
                    <Box sx={{ flex: "1 1 100%", minWidth: "300px", "@media (min-width:600px)": {
                        flex: 1,
                    } }}>
                        <Stack gap={1}>
                            <TextField variant="outlined" name="depth_range" label="Depth Range" type="text" value={state.depthRange} onChange={(e) => setDepthRange(e.target.value)} />
                            <TextField variant="outlined" name="description" label="Description" type="text" multiline maxRows={4} value={state.description} onChange={(e) => setDescription(e.target.value)} /> 
                            <Stack direction={"row"} gap={1} justifyContent={"flex-end"}>
                                <Button variant="outlined" color="error" onClick={handleRemoveRow}>Remove</Button>
                                <Button variant="outlined" color="warning" sx={{ boxShadow: "unset" }} onClick={handleUpdateRow}>Update</Button>
                                <Button variant="contained" sx={{ boxShadow: "unset" }} onClick={handleAddRow}>Add</Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </AccordionDetails>
            <AccordionActions>
                <Button color="error" onClick={props.onDelete}>Delete</Button>
            </AccordionActions>
        </Accordion>
    );
}
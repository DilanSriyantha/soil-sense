import { Box, Button, Stack, TextField } from "@mui/material";
import { DataGrid, GridCallbackDetails, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { SoilProperty } from "../MarkerInformation";
import { forwardRef, useCallback, useImperativeHandle, useReducer, useState } from "react";

interface SoilPropertyInputState {
    rows: SoilProperty[];
    depthRange: string;
    description: string;
    selectedId: number;
};

const initialState: SoilPropertyInputState = {
    rows: [],
    depthRange: "",
    description: "",
    selectedId: -1,
};

enum ActionType {
    CHANGE_DEPTH_RANGE,
    CHANGE_DESCRIPTION,
    CHANGE_SELECTED_ROW_IDX,
    ADD_ROW,
    UPDATE_ROW,
    DELETE_ROW,
    CLEAR_ALL,
};

const reducer = (state: SoilPropertyInputState, action: { type: ActionType, payload: any }): SoilPropertyInputState => {
    switch(action.type) {
        case ActionType.CHANGE_DEPTH_RANGE:
            return { ...state, depthRange: action.payload };
        case ActionType.CHANGE_DESCRIPTION:
            return { ...state, description: action.payload };
        case ActionType.CHANGE_SELECTED_ROW_IDX:
            return { ...state, selectedId: action.payload, depthRange: action.payload > -1 ? state.rows.find((r) => r.id == action.payload)!.depth_range : "", description: action.payload > -1 ? state.rows.find((r) => r.id == action.payload)!.description : "" };
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

export type SoilPropertyInputHandle = {
    clear: () => void;
    getRows: () => SoilProperty[];
};

const SoilPropertyInput = forwardRef<SoilPropertyInputHandle, {}>((_props, ref) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useImperativeHandle(ref, () => ({
        clear: () => {
            dispatch({ type: ActionType.CLEAR_ALL, payload: null });
        },
        getRows: () => {
            return state.rows;
        }
    }));

    const handleAddRow = useCallback(() => {
        if(state.depthRange.length < 1 && state.description.length < 1) return;

        dispatch({ type: ActionType.ADD_ROW, payload: { id: Math.random(), depth_range: state.depthRange, description: state.description } });
    }, [state.depthRange && state.description]);

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

    const handleRemoveRow = useCallback(() => {
        dispatch({ type: ActionType.DELETE_ROW, payload: null });
    }, []);

    const handleUpdateRow = useCallback(() => {
        dispatch({ type: ActionType.UPDATE_ROW, payload: null });
    }, []);

    return (
        <Box sx={{ display: "flex", flex: 3, gap: 1 }}>
            <Box sx={{ flex: 2 }}>
                <DataGrid
                    rows={state.rows}
                    columns={columns}
                    checkboxSelection
                    disableMultipleRowSelection
                    onRowSelectionModelChange={handleRowSelection}
                />
            </Box>
            <Box sx={{ flex: 1 }}>
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
    );
});

export default SoilPropertyInput;
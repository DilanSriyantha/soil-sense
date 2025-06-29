import { forwardRef, useCallback, useEffect, useImperativeHandle, useReducer } from "react";
import { SoilProperty } from "../MarkerInformation";
import { Button, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import BHInput from "./BHInput";

export interface BHInfo {
    number: number;
    soil_properties: SoilProperty[];
};

export interface BHInputPanelHandle {
    getBHInformation: () => BHInfo[];
    clearAll: () => void;
};

interface BHInputPanelState {
    bhInputs: BHInfo[];
};

const initialState: BHInputPanelState = {
    bhInputs: [],
};

enum ActionType {
    ADD_BH_INPUT,
    DELETE_BH_INPUT,
    ADD_SOIL_PROPERTY,
    UPDATE_SOIL_PROPERTY,
    DELETE_SOIL_PROPERTY,
    CLEAR_ALL,
};

const reducer = (state: BHInputPanelState, action: { type: ActionType, payload: any }): BHInputPanelState => {
    switch(action.type){
        case ActionType.ADD_BH_INPUT:
            return { bhInputs: [...state.bhInputs, action.payload] };
        case ActionType.DELETE_BH_INPUT:
            return { bhInputs: state.bhInputs.filter(bhi => bhi.number !== action.payload) };
        case ActionType.ADD_SOIL_PROPERTY:
            return { bhInputs: state.bhInputs.map((bh) => {
                if(bh.number === action.payload.num)
                    return {
                        ...bh,
                        soil_properties: [...bh.soil_properties, action.payload.sp]
                    };
                return bh;
            }) };
        case ActionType.UPDATE_SOIL_PROPERTY:
            return { bhInputs: state.bhInputs.map((bh) => {
                if(bh.number === action.payload.num)
                    return {
                        ...bh,
                        soil_properties: bh.soil_properties.map((sp) => {
                            if(sp.id === action.payload.spId)
                                return {
                                    ...sp,
                                    depth_range: action.payload.newDetails.depth_range,
                                    description: action.payload.newDetails.description
                                };
                            return sp;
                        })
                    };
                    return bh;
            }) };
        case ActionType.DELETE_SOIL_PROPERTY:
            return { bhInputs: state.bhInputs.map((bh) => {
                if(bh.number === action.payload.num)
                    return {
                        ...bh,
                        soil_properties: bh.soil_properties.filter((sp) => sp.id !== action.payload.spId)
                    };
                return bh;
            }) };
        case ActionType.CLEAR_ALL:
            return initialState;
        default:
            return state;
    }
};

const BHInputPanel = forwardRef<BHInputPanelHandle, {}>((_props, ref) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useImperativeHandle(ref, () => ({
        getBHInformation: () => {
            return state.bhInputs;
        },
        clearAll: () => {
            dispatch({ type: ActionType.CLEAR_ALL, payload: null });
        }
    }));

    const handleAddNewBH = useCallback(() => {
        const number = state.bhInputs.length < 1 ? 1 : state.bhInputs[state.bhInputs.length-1].number+1;
        dispatch({ type: ActionType.ADD_BH_INPUT, payload: { number: number, soil_properties: [] } });
    }, [state.bhInputs]);

    const handleDeleteBH = useCallback((number: number) => {
        dispatch({ type: ActionType.DELETE_BH_INPUT, payload: number });
    }, []);

    function handleAddSoilProp(bhNum: number, sp: SoilProperty) {
        dispatch({ type: ActionType.ADD_SOIL_PROPERTY, payload: {  num: bhNum, sp: sp } });
    }

    function handleUpdateSoilProp(bhNum: number, spId: number, newDetails: SoilProperty) {
        dispatch({ type: ActionType.UPDATE_SOIL_PROPERTY, payload: { num: bhNum, spId: spId, newDetails: newDetails } });
    }

    function handleRemoveSoilProp(bhNum: number, spId: number) {
        dispatch({ type: ActionType.DELETE_SOIL_PROPERTY, payload: { num: bhNum, spId: spId } });
    }

    return (
        <Stack direction={"column"} gap={1}>
            <div>
                {state.bhInputs.map((bhi, idx) => (
                    <BHInput key={idx} bhInfo={bhi} onDelete={() => handleDeleteBH(bhi.number)} onAddSoilProp={handleAddSoilProp} onUpdateSoilProp={handleUpdateSoilProp} onRemoveSoilProp={handleRemoveSoilProp} />
                ))}
            </div>
            <Button variant="text" startIcon={<Add />} onClick={handleAddNewBH}>New BH</Button>
        </Stack>
    );
});

export default BHInputPanel;
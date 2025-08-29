import { Action, ActionType } from "./types";

export const setField = (field: string, value: number) => {
    return { type: ActionType.SET_FIELD, payload: { field: field, value: value } };
}

export const setCohesion = (c: number): Action => {
    return setField("c", c);
};

export const setUnitWeight = (gamma: number): Action => {
    return setField("gamma", gamma);
};

export const setFrictionAngle = (phi: number): Action => {
    return setField("phi", phi);
};

export const setAppliedLoad = (applied_load: number): Action => {
    return setField("applied_load", applied_load);
};

export const setSafetyFactor = (FS: number): Action => {
    return setField("FS", FS);
};

export const setConcreteThickness = (t_conc: number): Action => {
    return setField("t_conc", t_conc);
};

export const startLoading = (): Action => {
    return { type: ActionType.START_LOADING, payload: null };
};

export const stopLoading = (): Action => {
    return { type: ActionType.STOP_LOADING, payload: null };
};

export const clear = (): Action => {
    return { type: ActionType.CLEAR, payload: null };
};
import { Action, ActionType, InputFormState } from "./types";

export const initialState: InputFormState = {
    c: 0,
    gamma: 0,
    phi: 0,
    applied_load: 0,
    FS: 0,
    t_conc: 0.3,
    loading: false,
};

export const reducer = (state: InputFormState, action: Action): InputFormState => {
    switch (action.type) {
        case ActionType.SET_FIELD:
            return { ...state, [action.payload.field]: action.payload.value };

        case ActionType.START_LOADING:
            return { ...state, loading: true };

        case ActionType.STOP_LOADING:
            return { ...state, loading: false };

        case ActionType.CLEAR:
            return { ...state, ...initialState };

        default:
            return state;
    }
};
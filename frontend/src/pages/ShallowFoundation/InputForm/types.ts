export type InputFormResult = Omit<InputFormState, "loading">;

export interface InputFormProps {
    onSubmit?: (result: InputFormResult) => void;
};

export interface InputFormState {
    c: number; // cohesion of the soil
    gamma: number; // effective unit weight of the soil
    phi: number; // friction angle
    applied_load: number; // load applied on footing
    FS: number // factor of safety
    t_conc?: number; // concrete thickness
    loading: boolean;
};

export enum ActionType {
    SET_FIELD,
    START_LOADING,
    STOP_LOADING,
    CLEAR
};

export type Action = { type: ActionType, payload: any };
import { memo, useCallback, useReducer } from "react";
import { InputFormProps, InputFormResult } from "./types";
import { Box, Button, InputAdornment, Stack, TextField } from "@mui/material";
import { initialState, reducer } from "./reducer";
import { clear, setField, startLoading, stopLoading } from "./actions";

function InputForm({ onSubmit }: InputFormProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleChange = useCallback((field: string, value: any) => {
        dispatch(setField(field, value));
    }, []);

    const handleClear = useCallback(() => {
        dispatch(clear());
    }, []);

    const handleSubmit = useCallback(() => {
        dispatch(startLoading());

        const res: InputFormResult = state;
        onSubmit?.apply(null, [res]);

        dispatch(stopLoading());
    }, [state]);

    return (
        <Box>
            <Stack sx={{ p: 1 }} gap={1}>
                <TextField
                    variant="outlined"
                    label="Cohesion of the soil (C)"
                    name="c"
                    type="number"
                    value={state.c}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end">kN/m^2</InputAdornment>
                        }
                    }}
                />

                <TextField
                    variant="outlined"
                    label="Effective unit weight of the soil (γ)"
                    name="gamma"
                    type="number"
                    value={state.gamma}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end">kN/m^3</InputAdornment>
                        }
                    }}
                />

                <TextField
                    variant="outlined"
                    label="Friction angle (φ)"
                    name="phi"
                    type="number"
                    value={state.phi}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end">o/Degrees</InputAdornment>
                        }
                    }}
                />

                <TextField
                    variant="outlined"
                    label="Applied load"
                    name="applied_load"
                    type="number"
                    value={state.applied_load}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end">kPa</InputAdornment>
                        }
                    }}
                />

                <TextField
                    variant="outlined"
                    label="Factor of safety"
                    name="FS"
                    type="number"
                    value={state.FS}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />

                {/* <TextField
                    variant="outlined"
                    label="Concrete thickness"
                    name="t_conc"
                    type="number"
                    value={state.t_conc}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                /> */}
            </Stack>
            <Stack gap={1} direction={"row"} justifyContent={"flex-end"} sx={{ p: 1 }}>
                <Button variant="outlined" onClick={handleClear}>Clear</Button>
                <Button variant="contained" onClick={handleSubmit} loading={state.loading} loadingPosition="start">Submit</Button>
            </Stack>
        </Box>
    );
}

export default memo(InputForm);
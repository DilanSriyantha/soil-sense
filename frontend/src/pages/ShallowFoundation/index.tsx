import { Card, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import { memo, useCallback, useState } from "react";
import InputForm from "./InputForm";
import { TerzhagiResultSet } from "./types";
import ResultPanel from "./ResultPanel";
import { InputFormResult } from "./InputForm/types";
import { useApi } from "../../hooks/useApi";

function ShallowFoundation() {
    const [result, setResult] = useState<TerzhagiResultSet | null>(null);

    const api = useApi();

    const onSubmit = useCallback(async (result: InputFormResult) => {
        try {
            const res = await api.post("/terzhagi", result);

            setResult(res as unknown as TerzhagiResultSet);
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <Container>
            <Card sx={{ mt: 2, mb: 2 }}>
                <Typography sx={{ p: 1, fontWeight: "600" }} textAlign={"start"} variant="body2">Terzhagi Calculator</Typography>

                <Divider />

                <InputForm onSubmit={onSubmit} />
            </Card>
            {result && (
                <ResultPanel resultSet={result} />
            )}
        </Container>
    );
}

export default memo(ShallowFoundation);
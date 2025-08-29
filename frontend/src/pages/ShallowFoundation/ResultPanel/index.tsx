import { memo } from "react";
import { ResultPanelProps, TerzhagiResultColumns } from "./types";
import { Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function ResultPanel({ resultSet }: ResultPanelProps) {

    return (
        <Stack direction={"column"} gap={2}>
            <Card>
                <Typography variant="body2" sx={{ fontWeight: "bold", padding: 1, textAlign: "start" }}>Square</Typography>
                <Divider />
                <Stack gap={1}>
                    {resultSet.Square.map((r, idx) => (
                        <DataGrid
                            key={idx}
                            rows={[r]}
                            columns={TerzhagiResultColumns}
                            getRowId={(row) => `${row.shape}-${Math.random()}`}
                            hideFooterPagination
                        />
                    ))}
                </Stack>
            </Card>
            <Card>
                <Typography variant="body2" sx={{ fontWeight: "bold", padding: 1, textAlign: "start" }}>Strip</Typography>
                <Divider />
                <Stack gap={1}>
                    {resultSet.Strip.map((r, idx) => (
                        <DataGrid
                            key={idx}
                            rows={[r]}
                            columns={TerzhagiResultColumns}
                            disableRowSelectionOnClick
                            getRowId={(row) => `${row.shape}-${Math.random()}`}
                            hideFooterPagination
                        />
                    ))}
                </Stack>
            </Card>
            <Card>
                <Typography variant="body2" sx={{ fontWeight: "bold", padding: 1, textAlign: "start" }}>Rectangular</Typography>
                <Divider />
                <Stack gap={1}>
                    {resultSet.Rectangular.map((r, idx) => (
                        <DataGrid
                            key={idx}
                            rows={[r]}
                            columns={TerzhagiResultColumns}
                            disableRowSelectionOnClick
                            getRowId={(row) => `${row.shape}-${Math.random()}`}
                            hideFooterPagination
                        />
                    ))}
                </Stack>
            </Card>
        </Stack>
    );
}

export default memo(ResultPanel);
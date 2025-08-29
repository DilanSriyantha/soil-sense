import { GridColDef } from "@mui/x-data-grid";
import { TerzhagiResult, TerzhagiResultSet } from "../types";

export interface ResultPanelProps {
    resultSet: TerzhagiResultSet;
};

export type TerzhagiResultColumn = GridColDef<TerzhagiResult>;

export const TerzhagiResultColumns: TerzhagiResultColumn[] = [
    { field: "size", headerName: "Size", width: 500 },
    { field: "depth", headerName: "Depth", width: 100 },
    { field: "volume", headerName: "Volume", width: 100 },
    { field: "q_safe", headerName: "q_safe", width: 100 },
    { field: "q_applied", headerName: "q_applied", width: 100 },
];
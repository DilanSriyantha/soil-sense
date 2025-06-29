import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { createContext, ReactNode, SyntheticEvent, useCallback, useContext, useState } from "react";

interface AlertContextType {
    showSuccess: (message: string) => void;
    showInfo: (message: string) => void;
    showWarning: (message: string) => void;
    showError: (message: string) => void;
};

interface AlertProviderProps {
    children?: ReactNode;
};

const AlertContext = createContext<AlertContextType>(
    {} as AlertContextType
);

export enum AlertType {
    SUCCESS,
    INFO,
    WARN,
    ERROR
};

export interface Alert {
    id: number;
    type: AlertType;
    message: string; 
};

const SEVERITIES: string[] = [
    "success",
    "info",
    "warning",
    "error"
];

export function AlertProvider({ children }: AlertProviderProps) {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    function showSuccess(message: string) {
        setAlerts((current) => [...current, { id: Math.random(), type: AlertType.SUCCESS, message: message }]);
    } 

    function showInfo(message: string) {
        setAlerts((current) => [...current, { id: Math.random(), type: AlertType.INFO, message: message }]);
    } 

    function showWarning(message: string) {
        setAlerts((current) => [...current, { id: Math.random(), type: AlertType.WARN, message: message }]);
    } 

    function showError(message: string) {
        setAlerts((current) => [...current, { id: Math.random(), type: AlertType.ERROR, message: message }]);
    } 

    function handleClose(id: number, _event?: Event | SyntheticEvent<any, Event>, reason?: SnackbarCloseReason): void {
        if(reason === "clickaway")
            return;

        setAlerts((current) => current.filter(a => a.id !== id));
    }

    return (
        <AlertContext.Provider value={{ showSuccess, showInfo, showWarning, showError }}>
            { children }
            <div>
                {
                    alerts.map((a, idx) => (
                        <Snackbar 
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            key={idx+"top"+"center"}
                            open={true} 
                            autoHideDuration={5000} 
                            onClose={(event?: Event | SyntheticEvent<any, Event>, reason?: SnackbarCloseReason) => handleClose(a.id, event, reason)}
                        >
                            <Alert
                                onClose={(event?: SyntheticEvent<any, Event>) => handleClose(a.id, event)}
                                severity={SEVERITIES[Number(a.type)] as any}
                                variant="standard"
                                sx={{ width: "100%" }}
                            >{a.message}</Alert>
                        </Snackbar>
                    ))
                }
            </div>
        </AlertContext.Provider>
    );
}

export function useAlert(): AlertContextType {
    const ctx = useContext(AlertContext);

    if(!ctx)
        throw new Error("useAlert must be used within an AlertProvider");

    return ctx;
};
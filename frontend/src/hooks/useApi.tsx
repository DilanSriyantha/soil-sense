import { createContext, ReactNode, useContext } from "react";

export interface Response {
    status: number;
    message: string;
};

interface ApiContextType {
    get: <R> (endpoint: string, urlParams?: Record<string, string>) => Promise<R>;
    post: (endpoint: string, requestBody: any, urlParams?: Record<string, string>) => Promise<Response>;
};

interface ApiProviderProps {
    children?: ReactNode;
}

const ApiContext = createContext<ApiContextType>(
    {} as ApiContextType
);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function ApiProvider({ children }: ApiProviderProps) {

    async function get <R> (endpoint: string, urlParams?: Record<string, string>) {
        try{
            const url = BASE_URL + endpoint + (urlParams ? `?${new URLSearchParams(urlParams).toString()}` : "");
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if(!res)
                throw new Error("failed getting response.");

            if(!res.ok)
                throw new Error(await res.json());

            return await res.json() as R;
        }catch(err){
            throw new Error(err instanceof Error ? err.message : "Unknown error.");
        }
    }

    async function post (endpoint: string, requestBody: any, urlParams?: Record<string, string>) {
        try{
            const url = BASE_URL + endpoint + (urlParams ? `?${new URLSearchParams(urlParams).toString()}` : "");
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });
            if(!res) 
                throw new Error("failed getting response.");

            if(!res.ok)
                throw new Error(await res.json());

            return await res.json() as Response;
        }catch(err) {
            throw new Error(err instanceof Error ? err.message : "Unknown error.");
        }
    }

    return(
        <ApiContext.Provider value={{ get, post }}>
            { children }
        </ApiContext.Provider>
    );
}

export function useApi(): ApiContextType {
    const ctx = useContext(ApiContext);

    if(!ctx)
        throw new Error("useApi must be used within an ApiProvider.");

    return ctx;
}
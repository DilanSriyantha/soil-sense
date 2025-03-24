import { createContext, ReactNode, useContext } from "react";

interface ApiContextType {
    get: <R> (endpoint: string, urlParams?: Record<string, string>) => Promise<R>;
};

interface ApiProviderProps {
    children?: ReactNode;
}

const ApiContext = createContext<ApiContextType>(
    {} as ApiContextType
);

export function ApiProvider({ children }: ApiProviderProps) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    async function get <R> (endpoint: string, urlParams?: Record<string, string>) {
        try{
            const url = baseUrl + endpoint + (urlParams ? `?${new URLSearchParams(urlParams).toString()}` : "");
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json;",
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

    return(
        <ApiContext.Provider value={{ get }}>
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
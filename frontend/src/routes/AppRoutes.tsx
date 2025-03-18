import { useRoutes } from "react-router";
import MainRoutes from "./MainRouter";

const AppRoutes = () => {
    return useRoutes(MainRoutes);
};

export default AppRoutes;
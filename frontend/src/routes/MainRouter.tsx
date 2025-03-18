import { RouteObject } from "react-router";
import BaseLayout from "../layouts/BaseLayout";
import Loader from "./Loader";
import { lazy } from "react";

const HomePage = Loader(lazy(() => import("../pages/Home")));

const MainRoutes: RouteObject[] = [
    {
        path: "/",
        element: <BaseLayout />,
        children: [
            {
                path: "",
                element: <HomePage />
            }
        ]
    }
];

export default MainRoutes
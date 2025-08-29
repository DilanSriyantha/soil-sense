import { RouteObject } from "react-router";
import BaseLayout from "../layouts/BaseLayout";
import Loader from "./Loader";
import { lazy } from "react";

const HomePage = Loader(lazy(() => import("../pages/Home")));
const InsertDataPage = Loader(lazy(() => import("../pages/InsertData")));
const ShallowFoundationPage = Loader(lazy(() => import("../pages/ShallowFoundation")));

const MainRoutes: RouteObject[] = [
    {
        path: "/",
        element: <BaseLayout />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
            {
                path: "insert-data",
                element: <InsertDataPage />
            },
            {
                path: "shallow-foundation",
                element: <ShallowFoundationPage />
            }
        ]
    }
];

export default MainRoutes
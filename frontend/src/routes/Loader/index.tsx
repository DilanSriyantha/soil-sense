import { Suspense } from "react";
import SuspenseLoader from "../../components/SuspenseLoader";

const Loader = (Component: React.ElementType) => (props: any) => (
    <Suspense fallback={<SuspenseLoader/>}>
        <Component {...props} />
    </Suspense>
);

export default Loader;
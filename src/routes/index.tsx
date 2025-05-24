import { RouteObject } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";

export const routes: Array<RouteObject> = [
    {
        element: <StoreLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/products",
                element: <ProductsPage />
            },
            {
                path: "/product/:productId",
                element: <ProductsPage isProductDetail={true} />
            }
        ]
    }
]
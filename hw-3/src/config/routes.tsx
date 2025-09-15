import { RouteObject } from "react-router-dom";
import App from "../App"; 
import { ProductsPage } from "../pages/ProductsPage";
import { ProductPage } from "../pages/ProductPage";

export const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/products',
        element: <ProductsPage />
      },
      {
        path: '/products/:id',
        element: <ProductPage />
      }
    ]
  }
];
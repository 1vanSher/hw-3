import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' 
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import { routesConfig } from "./config/routes";

const router = createBrowserRouter(routesConfig);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
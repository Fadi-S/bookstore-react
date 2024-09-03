import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider, createRoutesFromElements} from "react-router-dom";
import { Provider } from "react-redux";
import {store} from "./app/store";
import './index.css';
import routes from "./routes";

const router = createBrowserRouter(
    createRoutesFromElements(routes)
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>
);
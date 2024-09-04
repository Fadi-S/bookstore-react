import React from "react";
import { Route } from "react-router-dom";

import BooksIndex from "./pages/books_index";
import Layout from "./pages/layout";
import AuthLayout from "./pages/AuthLayout";
import Login from "./components/login";

export default (
    <Route path="/">
        <Route element={<Layout />}>
            <Route index element={<BooksIndex />} />

            <Route path="/profile" element={<BooksIndex />} />
        </Route>

        <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
        </Route>
    </Route>
);

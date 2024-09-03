import React from "react";
import { Route } from "react-router-dom";

import BooksIndex from "./pages/books_index";
import Layout from "./pages/layout";

export default (
    <Route path="/" element={<Layout />}>
        <Route index element={<BooksIndex />} />

        <Route path="/profile" element={<BooksIndex />} />
    </Route>
);

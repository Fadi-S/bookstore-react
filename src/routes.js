import React from "react";
import { Route } from "react-router-dom";

import BooksIndex from "./pages/books_index";
import Layout from "./pages/layout";
import Profile from "./pages/profile";
import ShowBook from "./pages/book_show";

export default (
    <Route path="/">
        <Route element={<Layout />}>
            <Route index element={<BooksIndex />} />
            <Route path="/books/:book" element={<ShowBook />} />

            <Route path="/profile" element={<Profile />} />
        </Route>
    </Route>
);

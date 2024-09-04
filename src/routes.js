import React from "react";
import { Route } from "react-router-dom";

import BooksIndex from "./pages/books_index";
import Layout from "./pages/layout";
import Profile from "./pages/profile";
import ShowBook from "./pages/book_show";
import CreateBook from "./pages/book_create";
import EditBook from "./pages/book_edit";
import Cart from "./pages/cart";

export default (
    <Route path="/" element={<Layout />}>
        <Route index element={<BooksIndex />} />
        <Route path="/books/create" element={<CreateBook />} />
        <Route path="/books/:book" element={<ShowBook />} />
        <Route path="/books/:book/edit" element={<EditBook />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/cart" element={<Cart />} />
    </Route>
);

import React from "react";
import {Route} from "react-router-dom";

import BooksIndex from "./pages/books_index";
import Layout from "./pages/layout";
import Profile from "./pages/profile";
import ShowBook from "./pages/book_show";
import CreateBook from "./pages/book_create";
import EditBook from "./pages/book_edit";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import CreateReview from "./pages/review_create";
import MyOrders from "./pages/my_orders";
import ManageOrders from "./pages/manage_orders";

export default (
    <Route path="/" element={<Layout/>}>
        <Route index element={<BooksIndex/>}/>
        <Route path="/books/create" element={<CreateBook/>}/>
        <Route path="/books/:book" element={<ShowBook/>}/>
        <Route path="/books/:book/edit" element={<EditBook/>}/>

        <Route path="/profile" element={<Profile/>}/>

        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>

        <Route path="/reviews/:book" element={<CreateReview/>}/>
        <Route path="/orders" element={<MyOrders/>}/>

        <Route path="/manage/orders" element={<ManageOrders/>}/>
    </Route>
);

import { configureStore } from "@reduxjs/toolkit";
import { booksApi } from "../features/books/books_slice";

export const store = configureStore({
    reducer: {
        [booksApi.reducerPath]: booksApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(booksApi.middleware),
});
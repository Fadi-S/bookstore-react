import {configureStore} from "@reduxjs/toolkit";
import {booksApi} from "../features/books/books_slice";
import AuthReducer, {authenticationApi} from "../features/authentication/authentication_slice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [booksApi.reducerPath]: booksApi.reducer,
        [authenticationApi.reducerPath]: authenticationApi.reducer,
        auth: AuthReducer,
    },
    middleware:
        (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(booksApi.middleware)
                .concat(authenticationApi.middleware),
});

setupListeners(store.dispatch);
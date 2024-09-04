import {configureStore} from "@reduxjs/toolkit";
import {booksApi} from "../features/books/books_slice";
import {profileApi} from "../features/profile/profile_slice";
import AuthReducer, {authenticationApi} from "../features/authentication/authentication_slice";
import { setupListeners } from "@reduxjs/toolkit/query";
import {adminBooksApi} from "../features/books/admin_book_slice";

export const store = configureStore({
    reducer: {
        [booksApi.reducerPath]: booksApi.reducer,
        [adminBooksApi.reducerPath]: adminBooksApi.reducer,
        [authenticationApi.reducerPath]: authenticationApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        auth: AuthReducer,
    },
    middleware:
        (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(booksApi.middleware)
                .concat(authenticationApi.middleware)
                .concat(profileApi.middleware)
                .concat(adminBooksApi.middleware),
});

setupListeners(store.dispatch);
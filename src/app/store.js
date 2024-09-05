import {configureStore} from "@reduxjs/toolkit";
import {booksApi} from "../features/books/books_slice";
import {profileApi} from "../features/profile/profile_slice";
import AuthReducer, {authenticationApi} from "../features/authentication/authentication_slice";
import { setupListeners } from "@reduxjs/toolkit/query";
import {adminBooksApi} from "../features/books/admin_book_slice";
import {cartApi} from "../features/cart/cart_slice";
import PageReducer from "../features/page/page_slice";
import {addressApi} from "../features/cart/address_slice";
import {reviewsApi} from "../features/books/reviews_slice";

export const store = configureStore({
    reducer: {
        [booksApi.reducerPath]: booksApi.reducer,
        [adminBooksApi.reducerPath]: adminBooksApi.reducer,
        [authenticationApi.reducerPath]: authenticationApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [addressApi.reducerPath]: addressApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        auth: AuthReducer,
        page: PageReducer,
    },
    middleware:
        (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(booksApi.middleware)
                .concat(authenticationApi.middleware)
                .concat(profileApi.middleware)
                .concat(adminBooksApi.middleware)
                .concat(cartApi.middleware)
                .concat(addressApi.middleware)
                .concat(reviewsApi.middleware)
    ,
});

setupListeners(store.dispatch);
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ROOT_URL } from "../../app/consts";

export const booksApi = createApi({
    reducerPath: "booksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ROOT_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;  // Access the token from the Redux state

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    tagTypes: ['Books'],
    endpoints(build) {
        return {
            fetchBooks: build.query({
                query: ([size, page]=[2, 1]) => `books?size=${size}&page=${page}`,
                providesTags: ['Books'],
            }),
            fetchBook: build.query({
                query: (id) => `books/${id}`,
                providesTags: ['Books'],
            }),
        };
    }
});

export const { useFetchBooksQuery, useFetchBookQuery } = booksApi;

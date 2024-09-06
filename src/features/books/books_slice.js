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
    endpoints: function (build) {
        return {
            fetchBooks: build.query({
                query: ({size = 8, page, sort}) => {
                    let url = `books`;
                    let params = new URLSearchParams();
                    if (size) params.set('size', size);
                    if (page) params.set('page', page);
                    if (sort) params.set('sort', sort);

                    return url + '?' + params.toString();
                },
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

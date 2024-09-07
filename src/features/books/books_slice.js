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
                query: ({size = '8', page, params}) => {
                    let url = `books`;
                    let newParams = new URLSearchParams();
                    if (size) newParams.set('size', size);
                    if (page) newParams.set('page', page);
                    if (params.sort) newParams.set('sort', params.sort);
                    for (let key in params) {
                        let value = params[key];
                        if (key.startsWith("filters[") && value != null && value !== "") {
                            newParams.set(key, "[]" + value);
                        }
                    }

                    return url + '?' + newParams.toString();
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

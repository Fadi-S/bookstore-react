import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ROOT_URL } from "../../app/consts";

export const adminBooksApi = createApi({
    reducerPath: "adminBooksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ROOT_URL + "/admin",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;  // Access the token from the Redux state

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    endpoints(build) {
        return {
            createBook: build.mutation({
                query: (book) => ({
                    url: "books/",
                    method: "POST",
                    body: book
                })
            }),
            updateBook: build.mutation({
                query: (book) => ({
                    url: `books/${book.id}`,
                    method: "PUT",
                    body: book
                })
            }),
            deleteBook: build.mutation({
                query: (id) => ({
                    url: `books/${id}`,
                    method: "DELETE"
                })
            }),
        };
    }
});

export const { useCreateBookMutation, useUpdateBookMutation, useDeleteBookMutation } = adminBooksApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ROOT_URL, TOKEN } from "../../app/consts";

export const booksApi = createApi({
    reducerPath: "booksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ROOT_URL,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
        },
    }),
    endpoints(build) {
        return {
            fetchBooks: build.query({
                query: (size=2, page=1,) => `books?size=${size}&page=${page}`
            }),
            fetchBook: build.query({
                query: (id) => `books/${id}`
            }),
            createBook: build.mutation({
                query: (book) => ({
                    url: "books",
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

export const { useFetchBooksQuery, useFetchBookQuery, useCreateBookMutation, useUpdateBookMutation, useDeleteBookMutation } = booksApi;

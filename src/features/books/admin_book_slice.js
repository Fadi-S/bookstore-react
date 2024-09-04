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

            if (headers.get("Content-Type") === "multipart/form-data;") {
                headers.delete("Content-Type");
            } else {
                headers.set("Content-Type", "application/json");
            }
            return headers;
        },
    }),
    tagTypes: ['Cart', 'Books'],
    endpoints(build) {
        return {
            createBook: build.mutation({
                query: (book) => {
                    let formData = new FormData();
                    for (let key in book) {
                        formData.append(key, book[key]);
                    }
                    return ({
                        url: "books",
                        method: "POST",
                        body: formData,
                        headers: {
                            "Content-Type": "multipart/form-data;"
                        }
                    });
                },
                invalidatesTags: ['Books'],
            }),
            updateBook: build.mutation({
                query: (book) => {
                    let formData = new FormData();
                    for (let key in book) {
                        if (key === "cover" && book[key] === null) {
                            continue;
                        }
                        formData.append(key, book[key]);
                    }

                    return ({
                        url: `books/${book.id}`,
                        method: "PATCH",
                        body: formData,
                        headers: {
                            "Content-Type": "multipart/form-data;"
                        }
                    });
                },
                invalidatesTags: ['Books', 'Cart'],
            }),
            deleteBook: build.mutation({
                query: (id) => ({
                    url: `books/${id}`,
                    method: "DELETE"
                }),
                invalidatesTags: ['Books', 'Cart'],
            }),
        };
    }
});

export const { useCreateBookMutation, useUpdateBookMutation, useDeleteBookMutation } = adminBooksApi;

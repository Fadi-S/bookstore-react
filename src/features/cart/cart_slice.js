import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ROOT_URL } from "../../app/consts";


export const cartApi = createApi({
    reducerPath: "cartApi",
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
    tagTypes: ['Cart', 'Orders'],
    endpoints(build) {
        return {
            fetchCart: build.query({
                query: () => `cart`,
                providesTags: ['Cart'],
            }),
            fetchCartItemsCount: build.query({
                query: () => `cart/count`,
                providesTags: ['Cart'],
            }),
            addToCart: build.mutation({
                query: ({id, quantity}) => {
                    let url = `cart/${id}/add`;
                    if (quantity) {
                        url += `?quantity=${quantity}`;
                    }
                    return ({
                        url: url,
                        method: "POST",
                    });
                },
                invalidatesTags: ['Cart'],
            }),
            removeFromCart: build.mutation({
                query: (id) => ({
                    url: `cart/${id}/remove`,
                    method: "DELETE",
                }),
                invalidatesTags: ['Cart'],
            }),
            checkout: build.mutation({
                query: ({address, paymentMethod}) => ({
                    url: `cart/checkout?addressId=${address}&paymentMethod=${paymentMethod}`,
                    method: "POST",
                }),
                invalidatesTags: ['Cart', 'Orders'],
            }),
        };
    }
});

export const { useFetchCartQuery, useAddToCartMutation, useRemoveFromCartMutation, useCheckoutMutation, useFetchCartItemsCountQuery } = cartApi;

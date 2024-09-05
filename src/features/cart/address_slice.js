import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ROOT_URL } from "../../app/consts";


export const addressApi = createApi({
    reducerPath: "addressApi",
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
    tagTypes: ['Addresses'],
    endpoints(build) {
        return {
            fetchAddresses: build.query({
                query: () => `addresses`,
                providesTags: ['Addresses'],
            }),
            createAddress: build.mutation({
                query: (address) => {
                    return ({
                        url: `addresses`,
                        method: "POST",
                        body: address,
                    });
                },
                invalidatesTags: ['Addresses'],
            }),
            deleteAddress: build.mutation({
                query: (id) => ({
                    url: `addresses/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ['Addresses'],
            }),
            updateAddress: build.mutation({
                query: (id) => ({
                    url: `addresses/${id}`,
                    method: "PATCH",
                }),
                invalidatesTags: ['Addresses'],
            }),
        };
    }
});

export const { useFetchAddressesQuery, useCreateAddressMutation, useDeleteAddressMutation, useUpdateAddressMutation } = addressApi;

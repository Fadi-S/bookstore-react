import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ROOT_URL} from "../../app/consts";

export const ordersApi = createApi(
    {
        reducerPath: "ordersApi",
        baseQuery: fetchBaseQuery({
            baseUrl: ROOT_URL,
            prepareHeaders(headers, {getState}) {
                const token = getState().auth.token;
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
                return headers;
            }
        }),
        tagTypes: ["Orders"],
        endpoints: (builder) => ({
            fetchOrders: builder.query({
                query: () => "orders",
                providesTags: ["Orders"],
            }),
        }),
    }
);

export const {useFetchOrdersQuery} = ordersApi;
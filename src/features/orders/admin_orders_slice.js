import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ROOT_URL} from "../../app/consts";

export const adminOrdersApi = createApi(
    {
        reducerPath: "adminOrdersApi",
        baseQuery: fetchBaseQuery({
            baseUrl: ROOT_URL + "/admin",
            prepareHeaders(headers, {getState}) {
                const token = getState().auth.token;
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
                return headers;
            }
        }),
        tagTypes: ["AdminOrders", "Orders"],
        endpoints: (builder) => ({
            fetchOrders: builder.query({
                query: ({page, size}) => {
                    let url = `orders`;
                    if (page && size) {
                        url += `?page=${page}&size=${size}`;
                    } else if (page) {
                        url += `?page=${page}`;
                    } else if (size) {
                        url += `?size=${size}`;
                    }

                    return url;
                },
                providesTags: ["AdminOrders"],
            }),
            fetchOrder: builder.query({
                query: (id) => `orders/${id}`,
                providesTags: ["AdminOrders"],
            }),
            updateOrderStatus: builder.query({
                query: ({id, status}) => ({
                    url: `orders/${id}`,
                    method: "PATCH",
                    body: {status}
                }),
                invalidatesTags: ["AdminOrders", "Orders"],
            }),
        }),
    }
);

export const {useFetchOrdersQuery, useFetchOrderQuery, useUpdateOrderStatusMutation} = adminOrdersApi;
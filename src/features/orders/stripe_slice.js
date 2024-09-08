import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ROOT_URL} from "../../app/consts";


export const stripeApi = createApi({
    reducerPath: "stripeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ROOT_URL + "/payments",
        prepareHeaders: (headers, {getState}) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => {
        return ({
            createSetupIntent: builder.mutation({
                query: () => ({
                    url: `/create-setup-intent`,
                    method: "POST",
                }),
            }),
            finishSetupIntent: builder.mutation({
                query: (intentId) => {
                    return ({
                        url: `/finish-setup-intent?intentId=${intentId}`,
                        method: "POST",
                        body: {intentId},
                    });
                },
            }),
            fetchPaymentMethods: builder.query({
                query: () => ({
                    url: `/methods`,
                    method: "GET",
                }),
            }),
        });
    },
});

export const { useCreateSetupIntentMutation, useFinishSetupIntentMutation, useFetchPaymentMethodsQuery } = stripeApi;
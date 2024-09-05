import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ROOT_URL} from "../../app/consts";


export const reviewsApi = createApi({
    reducerPath: "reviewsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ROOT_URL,
        prepareHeaders(headers, {getState}) {
            const token = getState().auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        }
    }),
    tagTypes: ["Reviews"],
    endpoints: (build) => ({
        getReviews: build.query({
            query: () => "reviews",
            providesTags: ["Reviews"],
        }),
        createReview: build.mutation({
            query: ({body, rating, bookId}) => {
                console.log(body, rating, bookId);
                return ({
                    url: `reviews/${bookId}`,
                    method: "POST",
                    body: {body, rating},
                });
            },
            invalidatesTags: ["Reviews", "Books"],
        }),
    }),
});

export const {useGetReviewsQuery, useCreateReviewMutation} = reviewsApi;
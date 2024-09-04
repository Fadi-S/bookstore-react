import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ROOT_URL } from "../../app/consts";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ROOT_URL + "/profile",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;  // Access the token from the Redux state

            if (token)
                headers.set("Authorization", `Bearer ${token}`);

            if(headers.get("Content-Type") === "multipart/form-data;"){
                headers.delete("Content-Type");
            }else {
                headers.set("Content-Type", "application/json");
            }

            return headers;
        },
    }),
    endpoints(build) {
        return {
            updateProfile: build.mutation({
                query: (values) => ({
                    url: "update",
                    method: "PATCH",
                    body: values
                })
            }),
            updatePicture: build.mutation({
                query: ({picture}) => {
                    const body = new FormData();
                    body.append('Content-Type', picture.type);
                    body.append('picture', picture);
                    console.log(picture);

                    return ({
                        url: "update/picture",
                        method: "PUT",
                        body: body,
                        headers: {
                            'Content-Type': 'multipart/form-data;'
                        },
                    });
                }
            }),
            updatePassword: build.mutation({
                query: (passwords) => {
                    return ({
                        url: "update/password",
                        method: "PATCH",
                        body: passwords
                    });
                }
            }),
        };
    }
});

export const { useUpdateProfileMutation, useUpdatePictureMutation, useUpdatePasswordMutation } = profileApi;

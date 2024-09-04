import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ROOT_URL } from "../../app/consts";
import { createSlice } from '@reduxjs/toolkit';

const user = localStorage.getItem('user');
const authorities = localStorage.getItem('authorities');

const initialState = {
    token: localStorage.getItem('token'),
    user: JSON.parse(user === "undefined" || user == null ? null : user),
    authorities: JSON.parse(authorities === "undefined" || authorities == null ? '[]' : authorities),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        setAuthorities: (state, action) => {
            state.authorities = action.payload;
            localStorage.setItem('authorities', JSON.stringify(action.payload));
        },
        clearAuth: (state) => {
            state.token = null;
            state.user = null;
            state.authorities = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('authorities');
        },
    },
});

export const { setToken, setUser, setAuthorities, clearAuth } = authSlice.actions;

export default authSlice.reducer;

export const authenticationApi = createApi({
    reducerPath: "authenticationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ROOT_URL,
        prepareHeaders(headers, {getState}) {
            const token = getState().auth.token;
            headers.set("Content-Type", "application/json");

            if (token && headers.has("Authorization")) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        }
    }),
    endpoints(build) {
        return {
            login: build.mutation({
                query: ({email, password}) => {
                    return ({
                        url: "login",
                        method: "POST",
                        body: {email, password},
                    });
                }
            }),
            register: build.mutation({
                query: ({firstName, lastName, email, password}) => ({
                    url: "register",
                    method: "POST",
                    body: {firstName, lastName, email, password}
                })
            }),
            logout: build.mutation({
                query: () => ({
                    url: "logout",
                    method: "DELETE",
                    headers: {
                        "Authorization": "",
                    }
                })
            }),
        };
    }
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authenticationApi;

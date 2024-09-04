import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    authForm: false,
    notification: {
        type: '',
        message: '',
        title: '',
        show: false,
    },
};

const pageSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        openLoginForm: (state) => {
            state.authForm = 'login';
        },
        openRegisterForm: (state) => {
            state.authForm = 'register';
        },
        closeAuthForm: (state) => {
            state.authForm = false;
        },
        showNotification: (state, action) => {
            state.notification = action.payload;
        },
        closeNotification: (state) => {
            state.notification.show = false;
        }
    },
});

export const { openLoginForm, openRegisterForm, showNotification, closeAuthForm, closeNotification } = pageSlice.actions;

export default pageSlice.reducer;
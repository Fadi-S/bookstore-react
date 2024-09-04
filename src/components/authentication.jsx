import {useLoginMutation, useRegisterMutation} from "../features/authentication/authentication_slice";
import {useEffect} from "react";

import { setToken, setAuthorities, setUser } from "../features/authentication/authentication_slice";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import Login from "./login";
import Register from "./register";
import { openRegisterForm, openLoginForm } from "../features/page/page_slice";

export default function Authentication(props) {

    const authForm = useAppSelector(state => state.page.authForm);

    const [
        loginUser,
        {
            data: loginData,
            error: loginError,
            isLoading: isLoginLoading,
            isSuccess: isLoginSuccess,
        }] = useLoginMutation();

    const [
        registerUser,
        {
            data: registerData,
            error: registerError,
            isLoading: isRegisterLoading,
            isSuccess: isRegisterSuccess,
        }] = useRegisterMutation();


    const dispatch = useAppDispatch();

    useEffect(() => {
        if(isLoginSuccess) {
            setTimeout(() => {
                props.onSuccess();
            }, 750);

            dispatch(setAuthorities(loginData.authorities));
            dispatch(setToken(loginData.token));
            dispatch(setUser(loginData.user));
        }
    }, [loginData, dispatch, isLoginSuccess, props]);

    useEffect(() => {
        if(isRegisterSuccess) {
            setTimeout(() => {
                props.onSuccess();
            }, 750);

            dispatch(setAuthorities(registerData.authorities));
            dispatch(setToken(registerData.token));
            dispatch(setUser(registerData.user));
        }
    }, [registerData, dispatch, isRegisterSuccess, props]);

    if(authForm === "register") {
        return (
            <Register
                onLogin={() => dispatch(openLoginForm())}
                error={registerError}
                isLoading={isRegisterLoading}
                isSuccess={isRegisterSuccess}
                onSubmit={registerUser}
            />
        );
    } else if(authForm === "login") {
        return (
            <Login
                onRegister={() => dispatch(openRegisterForm())}
                error={loginError}
                isLoading={isLoginLoading}
                isSuccess={isLoginSuccess}
                onSubmit={loginUser}
            />
        );
    }

    return (
        <div></div>
    );
}
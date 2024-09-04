import {useLoginMutation, useRegisterMutation} from "../features/authentication/authentication_slice";
import {useEffect, useState} from "react";

import { setToken, setAuthorities, setUser } from "../features/authentication/authentication_slice";
import {useAppDispatch} from "../app/hooks";
import Login from "./login";
import Register from "./register";

export default function Authentication(props) {

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

    const [showRegister, setShowRegister] = useState(props.showRegister);

    if(showRegister) {
        return (
            <Register
                onLogin={() => setShowRegister(false)}
                error={registerError}
                isLoading={isRegisterLoading}
                isSuccess={isRegisterSuccess}
                onSubmit={registerUser}
            />
        );
    }

    return (
        <Login
            onRegister={() => setShowRegister(true)}
            error={loginError}
            isLoading={isLoginLoading}
            isSuccess={isLoginSuccess}
            onSubmit={loginUser}
        />
    );
}
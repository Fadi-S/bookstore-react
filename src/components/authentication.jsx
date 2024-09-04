import {Link} from "react-router-dom";
import {useLoginMutation, useRegisterMutation} from "../features/authentication/authentication_slice";
import { Form, Field } from "react-final-form";
import LoadingSpinner from "./loading_spinner";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";

import { setToken, setAuthorities, setUser } from "../features/authentication/authentication_slice";
import {useAppDispatch} from "../app/hooks";
import Login from "./login";

function validate(values) {
    const errors = {};

    if (!values.email) {
        errors.email = "Enter an email";
    }

    if (!values.password) {
        errors.password = "Enter a password";
    }

    return errors;
}

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

    const [showRegister, setShowRegister] = useState(props.showRegister);

    if(showRegister) {
        return (
            "Show Register form"
        );
    } else {

    }

    return (
        <Login onSubmit={loginUser} />
    );
}
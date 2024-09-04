import {Link} from "react-router-dom";
import { useLoginMutation } from "../features/authentication/authentication_slice";
import { Form, Field } from "react-final-form";
import LoadingSpinner from "./loading_spinner";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/outline";
import {useEffect} from "react";

import { setToken, setAuthorities, setUser } from "../features/authentication/authentication_slice";
import {useAppDispatch} from "../app/hooks";

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

export default function Login(props) {

    const [
        loginUser,
        {
            data: loginData,
            error: loginError,
            isLoading: isLoginLoading,
            isSuccess: isLoginSuccess,
        }] = useLoginMutation();


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

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src={require('../logo.svg').default}
                    className="mx-auto h-14 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {loginError && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400"/>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    {loginError.data.message}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                {isLoginSuccess && (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon aria-hidden="true" className="h-5 w-5 text-green-400"/>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Login Successful</h3>
                            </div>
                        </div>
                    </div>
                )}

                <Form onSubmit={loginUser} validate={validate} render={({handleSubmit}) => (

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    component="input"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <Link to="/forget" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Field
                                component="input"
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {isLoginLoading ? <LoadingSpinner /> : "Sign in"}
                        </button>
                    </div>
                </form>
                    )} />

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
import {Link} from "react-router-dom";
import { Form } from "react-final-form";
import LoadingSpinner from "./loading_spinner";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/outline";
import MyField from "./MyField";

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
                {props.error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400"/>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    {props.error.data.message}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                {props.isSuccess && (
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

                <Form onSubmit={props.onSubmit} validate={validate} render={({handleSubmit}) => (

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <MyField
                            label="Email address"
                            id="email"
                            name="email"
                            type="email"
                            component="input"
                            required
                            autoComplete="email"
                        />

                        <MyField
                            label="Password"
                            component="input"
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                        />

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {props.isLoading ? <LoadingSpinner/> : "Sign in"}
                            </button>

                            <div className="text-sm mt-3">
                                <Link to="/forget" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </form>
                )}/>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <button onClick={props.onRegister}
                            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Register
                    </button>
                </p>
            </div>
        </div>
    );
}
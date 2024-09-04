import {Field} from "react-final-form";
import {ExclamationCircleIcon} from "@heroicons/react/20/solid";

export default function MyField(props) {
    return (
        <div>
            <div className="flex items-center justify-between">
                <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900">
                    {props.label}
                </label>
            </div>
            <div className="mt-1 relative">
                <Field
                    id={props.id}
                    name={props.name}
                    type={props.type}
                    component="input"
                    required={props.required}
                    autoComplete={props.autoComplete}
                    className={[
                        "block w-full rounded-md border-0 py-2 shadow-sm ring-1 focus:ring-2 focus:ring-inset ring-inset sm:text-sm sm:leading-6",
                        props.error ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500' : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'
                    ]}
                />
                {props.error && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon aria-hidden="true" className="h-5 w-5 text-red-500"/>
                    </div>
                )}
            </div>
            <p id={`${props.id}-error`} className="mt-2 text-sm text-red-600">
                {props.error}
            </p>
        </div>
    );
}
import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

export default function FileField({ name, ...props }) {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (files) => {
        const file = files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <div className={props.className + " flex items-start justify-start space-x-6"}>
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900">
                        {props.label}
                    </label>
                </div>
                <Field name={name}>
                    {({input: {value, onChange, ...input}}) => (
                        <div className="relative">
                            <input
                                {...input}
                                type="file"
                                accept={props.accept}
                                className={[
                                    "block w-full rounded-md border-0 py-2 shadow-sm ring-1 focus:ring-2 focus:ring-inset ring-inset sm:text-sm sm:leading-6",
                                    props.error
                                        ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500'
                                        : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'
                                ].join(' ')}
                                onChange={({target}) => {
                                    onChange(props.multiple ? target.files : target.files[0]);
                                    handleImageChange(target.files);
                                }}
                                {...props}
                            />
                            {props.error && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ExclamationCircleIcon aria-hidden="true" className="h-5 w-5 text-red-500"/>
                                </div>
                            )}
                        </div>
                    )}
                </Field>

                {props.error && (
                    <p className="mt-2 text-sm text-red-600">
                        {props.error}
                    </p>
                )}
            </div>

            <div>
                {preview && (
                    <div className="w-24">
                        <div className="relative h-0 pb-2/3 pt-2/3">
                            <img
                                alt="Preview"
                                className="absolute inset-0 w-full h-full object-cover rounded-lg transform transition-transform
                                        duration-200 group-hover:scale-110"
                                src={preview}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

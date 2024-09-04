import {Form} from "react-final-form";
import MyField from "./MyField";
import FileField from "./FileField";
import {useEffect, useState} from "react";
import {Transition} from "@headlessui/react";

export default function BookForm(props) {

    const errors = props.error?.data?.message?.errors;

    const [isSuccessful, setIsSuccessful] = useState(false);
    useEffect(() => {
        if (props.isSuccessful) {
            setIsSuccessful(true);

            setTimeout(() => {
                setIsSuccessful(false);
            }, 5000);
        }
    }, [props.isSuccessful]);

    return (
        <div>
            <Transition show={isSuccessful}>
                <div className="transition duration-300 ease-in data-[closed]:opacity-0 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                    <p className="font-bold">Success</p>
                    <p>Book saved successfully</p>
                </div>
            </Transition>

            <Form onSubmit={props.onSubmit} initialValues={props.initialValues} render={({handleSubmit}) => (
                <form className="mt-4" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div
                        className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
                        <MyField
                            label="Title"
                            name="title"
                            id="title"
                            type="text"
                            error={errors?.title}
                        />

                        <MyField
                            label="Author"
                            name="author"
                            id="author"
                            type="text"
                            error={errors?.author}
                        />

                        <MyField
                            label="Genre"
                            name="genre"
                            id="genre"
                            type="text"
                            error={errors?.genre}
                        />

                        <MyField
                            label="Price"
                            name="price"
                            id="price"
                            type="number"
                            error={errors?.price}
                        />

                        <MyField
                            label="Quantity"
                            name="quantity"
                            id="quantity"
                            type="number"
                            error={errors?.quantity}
                        />

                        <FileField
                            label="Cover"
                            name="cover"
                            id="cover"
                            accept="image/*"
                            error={errors?.cover}
                        />

                        <MyField
                            className="col-span-2"
                            label="Overview"
                            name="overview"
                            rows={6}
                            id="overview"
                            component="textarea"
                            error={errors?.title}
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {props.isLoading ? "Saving..." : "Save Book"}
                    </button>
                </form>
            )}/>
        </div>
    );
}
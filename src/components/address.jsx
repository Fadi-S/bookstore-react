import {useCreateAddressMutation} from "../features/cart/address_slice";
import {useEffect} from "react";
import {showNotification} from "../features/page/page_slice";
import {Field, Form} from "react-final-form";
import MyField from "./MyField";

export default function Address(props) {
    const [createAddress, {error, isLoading, isSuccess}] = useCreateAddressMutation();

    useEffect(() => {
        if (isSuccess) {
            showNotification({title: "Success", message: "Address created successfully", type: "success", show: true});

            props.onClose();
        }
    }, [isLoading, isSuccess, error]);

    const errors = error?.data?.message?.errors;

    return (
        <Form onSubmit={createAddress} render={({handleSubmit}) => (
            <form onSubmit={handleSubmit}>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <MyField
                        label="Full Name"
                        id="full-name"
                        name="fullName"
                        type="text"
                        autoComplete="full-name"
                        className="sm:col-span-2"
                        required
                        error={errors?.fullName}
                    />

                    <MyField
                        label="Address"
                        id="address1"
                        name="street1"
                        type="text"
                        autoComplete="street1"
                        className="sm:col-span-2"
                        required
                        error={errors?.street1}
                    />

                    <MyField
                        label="Address 2 (Optional)"
                        id="address2"
                        name="street2"
                        type="text"
                        autoComplete="street2"
                        error={errors?.street2}
                        className="sm:col-span-2"
                    />

                    <MyField
                        label="City"
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="city"
                        error={errors?.city}
                        className="sm:col-span-2"
                    />


                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <div className="mt-1">
                            <Field name="country" component="select" id="country"
                                   autoComplete="country-name"
                                   className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 focus:ring-2 focus:ring-inset ring-inset sm:text-sm sm:leading-6 text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600">

                                <option value="EG">Egypt</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                            </Field>
                        </div>
                    </div>

                    <MyField
                        label="Postal code"
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        autoComplete="postalCode"
                        error={errors?.postalCode}
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {isLoading ? "Creating..." : "Create Address"}
                </button>
            </form>
        )}/>
    );
}
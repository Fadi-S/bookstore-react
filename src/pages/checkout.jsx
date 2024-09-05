import {useFetchAddressesQuery} from "../features/cart/address_slice";
import {useFetchCartQuery, useCheckoutMutation} from "../features/cart/cart_slice";
import {BOOK_IMAGE_URL} from "../app/consts";
import {useConvertPrice} from "../app/helpers";
import {Radio, RadioGroup} from "@headlessui/react";
import {useEffect, useState} from "react";
import Modal from "../components/modal";
import Address from "../components/address";
import {closeNotification, showNotification} from "../features/page/page_slice";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../app/hooks";
import {ordersApi} from "../features/orders/orders_slice";

export default function Checkout() {

    const {data: addresses, isLoadingAddresses} = useFetchAddressesQuery();
    const {data: cart, isLoadingCart} = useFetchCartQuery();
    const [checkout, {isLoading: isCheckoutLoading, isSuccess, error}] = useCheckoutMutation();

    const toReadablePrice = useConvertPrice;

    const [openAddress, setOpenAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isSuccess) {
            dispatch(showNotification({title: "Success", message: "Order placed successfully", type: "success", show: true}));

            dispatch(ordersApi.util.resetApiState())

            setTimeout(() => {
                dispatch(closeNotification());
            }, 3000);

            navigate("/orders");
        }

    }, [isCheckoutLoading, isSuccess]);

    if (isLoadingAddresses || isLoadingCart || !cart || !addresses) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto max-w-2xl lg:max-w-none">
            <h1 className="sr-only">Checkout</h1>

            <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                <div>
                    <div className="mt-10">
                        <h2 className="text-lg font-medium text-gray-900">Choose Shipping Address</h2>

                        <Modal open={openAddress} onClose={() => setOpenAddress(false)}>
                            <Address onClose={() => setOpenAddress(false)} />
                        </Modal>

                        <fieldset className="mt-3" aria-label="Server size">
                            <RadioGroup value={selectedAddress} onChange={setSelectedAddress} className="space-y-4">
                                {addresses.map((address) => (
                                    <Radio
                                        key={address.id}
                                        value={address}
                                        aria-label={address.fullName}
                                        aria-description={address.fullAddress}
                                        className="group relative block cursor-pointer rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm focus:outline-none data-[focus]:border-indigo-600 data-[focus]:ring-2 data-[focus]:ring-indigo-600 sm:flex sm:justify-between"
                                    >
                                        <span className="flex items-center">
                                          <span className="flex flex-col text-sm">
                                            <span className="font-medium text-gray-900">{address.fullName}</span>
                                            <span className="text-gray-500">
                                              <span className="block sm:inline">

                                              </span>{' '}
                                                <span className="block sm:inline">{address.fullAddress}</span>
                                            </span>
                                          </span>
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-600"
                                        />
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </fieldset>

                        <button type="button" onClick={() => setOpenAddress(true)} className="mt-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Add new address
                        </button>
                    </div>
                </div>

                {/* Order summary */}
                <div className="mt-10 lg:mt-0">
                    <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

                    <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                        <h3 className="sr-only">Items in your cart</h3>
                        <ul role="list" className="divide-y divide-gray-200">
                            {cart.items.map((item) => (
                                <li key={item.id} className="flex px-4 py-6 sm:px-6">
                                    <div className="flex-shrink-0">
                                        <img alt={item.title} src={BOOK_IMAGE_URL + item.cover}
                                             className="w-20 rounded-md"/>
                                    </div>

                                    <div className="ml-6 flex flex-1 flex-col">
                                        <div className="flex">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm">
                                                    <a href={`/books/${item.id}`}
                                                       className="font-medium text-gray-700 hover:text-gray-800">
                                                        {item.title}
                                                    </a>
                                                </h4>
                                                <p className="mt-1 text-sm text-gray-500">{item.author}</p>
                                                <p className="mt-1 text-sm text-gray-500">{item.genre}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-1 items-end justify-between pt-2">
                                            <p className="mt-1 text-sm font-medium text-gray-900">${toReadablePrice(item.priceInPennies)}</p>

                                            <div className="ml-4">

                                                <label htmlFor="quantity" className="sr-only">
                                                    Quantity
                                                </label>
                                                <select
                                                    disabled={true}
                                                    id={"quantity-" + item.id}
                                                    name="quantity"
                                                    value={item.quantity}
                                                    className="rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    <option value={item.quantity}>{item.quantity}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">${toReadablePrice(cart.subTotal)}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-sm">Shipping</dt>
                                <dd className="text-sm font-medium text-gray-900">${toReadablePrice(cart.shipping)}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-sm">Taxes</dt>
                                <dd className="text-sm font-medium text-gray-900">${toReadablePrice(cart.tax)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                                <dt className="text-base font-medium">Total</dt>
                                <dd className="text-base font-medium text-gray-900">${toReadablePrice(cart.total)}</dd>
                            </div>
                        </dl>

                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <button
                                type="button"
                                disabled={selectedAddress === null}
                                onClick={() => checkout(selectedAddress?.id)}
                                className="w-full rounded-md border border-transparent bg-indigo-600
                                 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                   focus:ring-offset-gray-50 disabled:bg-gray-300 disabled:text-gray-800 transition-colors duration-200"
                            >
                                {isCheckoutLoading ? "Placing Order..." : "Confirm order"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
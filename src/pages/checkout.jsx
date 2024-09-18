import {useFetchAddressesQuery} from "../features/cart/address_slice";
import { useFetchPaymentMethodsQuery } from "../features/orders/stripe_slice";
import {useFetchCartQuery, useCheckoutMutation} from "../features/cart/cart_slice";
import {BOOK_IMAGE_URL} from "../app/consts";
import {useConvertPrice} from "../app/helpers";
import {Radio, RadioGroup} from "@headlessui/react";
import {useEffect, useState} from "react";
import Modal from "../components/modal";
import Address from "../components/address";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../app/hooks";
import {ordersApi} from "../features/orders/orders_slice";
import If from "../components/if";
import StripeSetup from "../components/stripe_setup";
import {notify} from "../app/helpers";
import {CreditCardIcon, MapPinIcon} from "@heroicons/react/24/solid";

export default function Checkout() {

    const {data: addresses, isLoading: isLoadingAddresses} = useFetchAddressesQuery();
    const {data: paymentMethods, isLoading: isPaymentMethodsLoading, refetch: refetchPayments} = useFetchPaymentMethodsQuery();
    const {data: cart, isLoading: isLoadingCart} = useFetchCartQuery();

    const [checkout, {isLoading: isCheckoutLoading, isSuccess, error: checkoutError}] = useCheckoutMutation();

    const toReadablePrice = useConvertPrice;

    const [openAddress, setOpenAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [showAddCard, setShowAddCard] = useState(false);

    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isSuccess) {
            notify("Order placed successfully", dispatch);

            dispatch(ordersApi.util.resetApiState());

            navigate("/orders");
        } else if(checkoutError) {
            notify(checkoutError.data?.message, dispatch, "Error", "error");

            dispatch(ordersApi.util.resetApiState());

            navigate("/orders");
        }

    }, [isCheckoutLoading, isSuccess]);

    useEffect(() => {
        if(paymentMethods && paymentMethods.default) {
            setSelectedPaymentMethod(paymentMethods.default);
        }

    }, [isPaymentMethodsLoading]);

    const cardAdded = (paymentMethod) => {
        notify("Card added successfully", dispatch);
        setShowAddCard(false);

        refetchPayments();

        setSelectedPaymentMethod(paymentMethod);
    }

    if (isLoadingAddresses || isLoadingCart || !cart || !addresses) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto max-w-2xl lg:max-w-none">
            <h1 className="sr-only">Checkout</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
                <div className="col-span-6">
                    <div className="mt-10">
                        <h2 className="text-lg font-medium text-gray-900">Choose Shipping Address</h2>

                        <Modal open={openAddress} onClose={() => setOpenAddress(false)}>
                            <Address onClose={() => setOpenAddress(false)}/>
                        </Modal>

                        <fieldset className="mt-3" aria-label="Address">
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

                        <button
                            type="button"
                            onClick={() => setOpenAddress(true)}
                            className="mt-3 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <MapPinIcon aria-hidden="true" className="-ml-0.5 h-5 w-5"/>
                            Add new Address
                        </button>
                    </div>

                    <hr className="mt-6 border-gray-400"/>

                    <div className="mt-6">
                        <h2 className="text-lg font-medium text-gray-900">Choose Payment Method</h2>

                        <fieldset className="mt-3" aria-label="Payment Method">
                            <RadioGroup value={selectedPaymentMethod} onChange={setSelectedPaymentMethod}
                                        className="space-y-4">
                                {(isPaymentMethodsLoading || !paymentMethods) && (
                                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600"
                                         xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}

                                {paymentMethods && paymentMethods.list.map((pm) => (
                                    <Radio
                                        key={pm.id}
                                        value={pm.id}
                                        aria-label={pm.fullName}
                                        aria-description={`Card ending in ${pm.last4}`}
                                        className="group relative block items-center cursor-pointer rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm focus:outline-none data-[focus]:border-indigo-600 data-[focus]:ring-2 data-[focus]:ring-indigo-600 sm:flex sm:justify-between"
                                    >
                                        <span className="flex items-center">
                                          <span className="flex flex-col text-sm">
                                            <span className="font-medium text-gray-900 flex items-start">
                                                <span>•••• {pm.last4}</span>
                                                {paymentMethods.default === pm.id && (
                                                    <span className="text-xs text-indigo-700 ml-1">(Default)</span>
                                                )}
                                            </span>
                                            <span className="text-gray-500">
                                              <span className="block sm:inline">


                                              </span>{' '}
                                                <span className="block sm:inline">
                                                    <span className="text-gray-400">Expires: </span>
                                                    <span className="text-gray-700">{pm.expMonth}/{pm.expYear}</span>
                                                </span>
                                            </span>
                                          </span>
                                        </span>
                                        <span
                                            className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right h-full">
                                          <span className="font-medium text-gray-900">
                                              <img className="w-16"
                                                   src={require('../card_logos/' + pm.cardBrand + '.svg')}
                                                   alt={pm.cardBrand}/>
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

                        <div className="mb-4">
                            <If condition={!showAddCard}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddCard(true)}
                                    className="mt-3 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    <CreditCardIcon aria-hidden="true" className="-ml-0.5 h-5 w-5"/>
                                    Add new card
                                </button>
                            </If>
                        </div>

                        <If condition={showAddCard}>
                            <StripeSetup onSuccess={cardAdded} address={selectedAddress}/>
                        </If>
                    </div>
                </div>

                {/* Order summary */}
                <div className="mt-10 lg:mt-0 col-span-6">
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
                                disabled={selectedAddress === null || selectedPaymentMethod === null}
                                onClick={() => checkout({address: selectedAddress?.id, paymentMethod: selectedPaymentMethod})}
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
            </div>
        </div>
    );
}
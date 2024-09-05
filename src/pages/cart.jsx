import { XMarkIcon } from '@heroicons/react/20/solid'
import {BOOK_IMAGE_URL} from "../app/consts";
import React, {useEffect} from "react";
import { useRemoveFromCartMutation, useFetchCartQuery, useAddToCartMutation } from "../features/cart/cart_slice";
import { useConvertPrice } from "../app/helpers";
import {closeNotification, showNotification} from "../features/page/page_slice";
import {useAppDispatch} from "../app/hooks";
import {Link} from "react-router-dom";

export default function Cart() {
    const [removeFromCart] = useRemoveFromCartMutation();
    const [addToCart, {error: errorCart, isLoading: isAddLoading}] = useAddToCartMutation();

    const {data: cart} = useFetchCartQuery();

    const toReadablePrice = useConvertPrice;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(errorCart) {
            dispatch(showNotification({title: "Error", message: errorCart.data.message, type: "error", show: true}));

            setTimeout(() => {
                dispatch(closeNotification())
            }, 5000);
        }

    }, [isAddLoading])

    if (!cart) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
                <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <section aria-labelledby="cart-heading" className="lg:col-span-7">
                        <h2 id="cart-heading" className="sr-only">
                            Items in your shopping cart
                        </h2>

                        {cart.items.length === 0 && (
                            <Link
                                to="/"
                                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                                </svg>

                                <span
                                    className="mt-2 block text-sm font-semibold text-gray-900">No books in your cart, browse to find some.</span>
                            </Link>
                        )}

                        <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                            {cart.items.map((item, itemIdx) => (
                                <li key={item.id} className="flex py-6 sm:py-10">
                                    <div className="w-48">
                                        <div className="relative h-0 pb-2/3 pt-2/3">
                                            <img
                                                alt={`${item.title}`}
                                                className="absolute inset-0 w-full h-full object-cover rounded-lg transform transition-transform
                                                duration-200 group-hover:scale-110"
                                                src={BOOK_IMAGE_URL + item.cover}
                                            />
                                        </div>
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <a href={`/books/${item.id}`}
                                                           className="font-medium text-gray-700 hover:text-gray-800">
                                                            {item.title}
                                                        </a>
                                                    </h3>
                                                </div>
                                                <div className="mt-1 flex text-sm">
                                                    <p className="text-gray-500">{item.author}</p>
                                                    <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{item.genre}</p>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900">${item.priceInPennies / 100}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <label htmlFor={`quantity-${itemIdx}`} className="sr-only">
                                                    Quantity, {item.title}
                                                </label>
                                                <select
                                                    id={`quantity-${itemIdx}`}
                                                    name={`quantity-${itemIdx}`}
                                                    value={item.quantity}
                                                    onChange={(event) => addToCart({id: item.id, quantity: event.target.value})}
                                                    className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    {Array.from({ length: 10 }).map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    )
                                                    )}
                                                    {item.quantity > 10 && (
                                                        <option value={item.quantity}>{item.quantity}</option>)}
                                                </select>

                                                <div className="absolute right-0 top-0">
                                                    <button type="button"
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                                                        <span className="sr-only">Remove</span>
                                                        <XMarkIcon aria-hidden="true" className="h-5 w-5"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Order summary */}
                    <section
                        aria-labelledby="summary-heading"
                        className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                    >
                        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                            Order summary
                        </h2>

                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">${toReadablePrice(cart.subTotal)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="flex items-center text-sm text-gray-600">
                                    <span>Shipping estimate</span>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">${toReadablePrice(cart.shipping)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="flex text-sm text-gray-600">
                                    <span>Tax (14% VAT)</span>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">${toReadablePrice(cart.tax)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                <dd className="text-base font-medium text-gray-900">${toReadablePrice(cart.total)}</dd>
                            </div>
                        </dl>

                        <div className="mt-6 flex items-center">
                            <Link
                                to="/checkout"
                                className="w-full text-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            >
                                Checkout
                            </Link>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    )
}

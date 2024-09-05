import {useFetchOrdersQuery} from "../features/orders/orders_slice";
import {CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon} from "@heroicons/react/24/outline";
import {Link} from "react-router-dom";
import {useConvertPrice, useParseDate} from "../app/helpers";
import {BOOK_IMAGE_URL} from "../app/consts";
import ReadMore from "../components/readmore";
import {useEffect} from "react";
import {useAddToCartMutation} from "../features/cart/cart_slice";
import {useAppDispatch} from "../app/hooks";
import {closeNotification, showNotification} from "../features/page/page_slice";

function renderStatus(status) {
    if(status === "Delivered") {
        return (
            <>
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true"/>
                <p className="ml-2 text-sm font-medium text-green-500">
                    {status}
                </p>
            </>
        );
    }
    if (status === "Pending") {
        return (
            <>
                <ClockIcon className="h-5 w-5 text-yellow-400" aria-hidden="true"/>
                <p className="ml-2 text-sm font-medium text-yellow-700">
                    {status}
                </p>
            </>
        );
    }
    if (status === "Shipped") {
        return (
            <>
                <TruckIcon className="h-5 w-5 text-blue-400" aria-hidden="true"/>
                <p className="ml-2 text-sm font-medium text-blue-500">
                    {status}
                </p>
            </>
        );
    }

    if (status === "Canceled") {
        return (
            <>
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true"/>
                <p className="ml-2 text-sm font-medium text-red-500">
                    {status}
                </p>
            </>
        );
    }
}

export default function MyOrders() {
    const {data: orders, isLoading} = useFetchOrdersQuery();
    const [addToCart, {isSuccess: isAddSuccess}] = useAddToCartMutation();

    const toReadablePrice = useConvertPrice;
    const parseDate = useParseDate;

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isAddSuccess) {
            dispatch(showNotification({title: "Success", message: "Book added to cart", type: "success", show: true}));

            setTimeout(() => {
                dispatch(closeNotification());
            });
        }
    }, [isAddSuccess]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white">
            <div className="py-16 sm:py-24">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Check the status of recent orders, and discover similar products.
                        </p>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="sr-only">Recent orders</h2>
                    <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                        <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                            {orders.map((order) => (
                                <div
                                    key={order.number}
                                    className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                                >
                                    <h3 className="sr-only">
                                        Order placed on <time
                                        dateTime={order.createdAt}>{parseDate(order.createdAt)}</time>
                                    </h3>

                                    <div
                                        className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                                        <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                                            <div>
                                                <dt className="font-medium text-gray-900">Order number</dt>
                                                <dd className="mt-1 text-gray-500">{order.number}</dd>
                                            </div>
                                            <div className="hidden sm:block">
                                                <dt className="font-medium text-gray-900">Date placed</dt>
                                                <dd className="mt-1 text-gray-500">
                                                    <time dateTime={order.createdAt}>{parseDate(order.createdAt)}</time>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="font-medium text-gray-900">Total amount</dt>
                                                <dd className="mt-1 font-medium text-gray-900">${toReadablePrice(order.priceInPennies)}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Products */}
                                    <h4 className="sr-only">Items</h4>
                                    <ul role="list" className="divide-y divide-gray-200">
                                        {order.books.map((book) => (
                                            <li key={book.id} className="p-4 sm:p-6">
                                                <div className="flex items-center sm:items-start">
                                                    <div
                                                        className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                                                        <img
                                                            src={BOOK_IMAGE_URL + book.cover}
                                                            alt={book.title}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="ml-6 flex-1 text-sm">
                                                        <div
                                                            className="font-medium text-gray-900 sm:flex sm:justify-between">
                                                            <h5>{book.title}</h5>
                                                            <p className="mt-2 sm:mt-0">${toReadablePrice(book.priceInPennies)}</p>
                                                        </div>
                                                        <div className="hidden text-gray-500 sm:mt-2 sm:block">
                                                            <ReadMore
                                                                text={book.overview}
                                                                maxLength={350}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order status */}
                                                <div className="mt-6 sm:flex sm:justify-between">
                                                    <div className="flex items-center">
                                                        {renderStatus(order.status)}
                                                    </div>

                                                    <div
                                                        className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                                                        <div className="flex flex-1 justify-center">
                                                            <Link
                                                                to={`/books/${book.id}`}
                                                                className="whitespace-nowrap text-indigo-600 hover:text-indigo-500"
                                                            >
                                                                View Book
                                                            </Link>
                                                        </div>
                                                        <div className="flex flex-1 justify-center pl-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => addToCart({id: book.id})}
                                                                className="whitespace-nowrap text-indigo-600 hover:text-indigo-500">
                                                                Buy again
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
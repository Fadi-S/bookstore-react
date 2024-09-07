import { useFetchOrderQuery, useUpdateOrderStatusMutation } from "../features/orders/admin_orders_slice";
import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {BOOK_IMAGE_URL} from "../app/consts";
import {useConvertPrice, useParseDate} from "../app/helpers";
import Modal from "../components/modal";
import {notify} from "../app/helpers";
import {useAppDispatch} from "../app/hooks";
import ReadMore from "../components/readmore";

export default function ManageOrder() {
    const params = useParams();

    const {data: order, isLoading} = useFetchOrderQuery(params.order);
    const [updateOrderStatus, {isLoading: updatingStatus, isSuccess: updatedStatus }] = useUpdateOrderStatusMutation();

    useEffect(() => {
        if(!isLoading)
            document.title = `Order ${order?.number} | Bookstore`;
    }, [isLoading]);

    const toReadablePrice = useConvertPrice;
    const parseDate = useParseDate;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useAppDispatch();
    useEffect(() => {
        if(updatedStatus) {
            notify("Order status updated successfully", dispatch);
            setIsModalOpen(false);
        }
    }, [updatingStatus]);

    if(isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    const statuses = {
        "Pending": "bg-yellow-100 text-yellow-800",
        "Shipped": "bg-blue-100 text-blue-800",
        "Delivered": "bg-green-100 text-green-800",
        "Canceled": "bg-red-100 text-red-800",
    };

    return (
        <div className="flex flex-col space-y-8">
            <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                <div
                    className="flex flex-col justify-between border-b border-gray-200 p-4">

                    <h1 className="text-xl font-bold">Shipping address</h1>

                    <div className="flex flex-col space-y-2 mt-4">
                        <p className="text-lg font-medium">{order.address.fullName}</p>
                        <p>{order.address.street1} {order.address.street2}</p>
                        <p>{order.address.city}, {order.address.postalCode}</p>
                        <p>{order.address.country}</p>
                    </div>
                </div>
                </div>
                <div
                    key={order.number}
                    className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                >
                    <h3 className="sr-only">
                        Order placed on <time
                        dateTime={order.createdAt}>{parseDate(order.createdAt)}</time>
                    </h3>

                    <div
                        className="flex items-center justify-between border-b border-gray-200 p-4">
                        <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-4 lg:col-span-2">
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

                            <div>
                                <dt className="font-medium text-gray-900">Status</dt>
                                <dd className="mt-1 font-medium text-gray-900 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className={"inline-flex items-center px-6 py-1.5 rounded-full text-xs font-medium " + statuses[order.status]}>
                                        {order.status}
                                    </button>
                                </dd>
                            </div>

                            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                                <h3 className="text-lg font-medium">Change order status</h3>

                                <div className="mt-3 grid grid-cols-2 gap-y-12">
                                    {Object.keys(statuses).map((status) => (
                                        <button
                                            key={status}
                                            disabled={order.status === status}
                                            className={"inline-flex mx-auto items-center px-8 py-3 rounded-full text-sm font-medium " + statuses[status]}
                                            onClick={() => {
                                                updateOrderStatus({
                                                    id: order.id,
                                                    status: status,
                                                });
                                            }}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </Modal>
                        </dl>
                    </div>

                    {/* Products */}
                    <h4 className="sr-only">Items</h4>
                    <ul className="divide-y divide-gray-200">
                        {order.books.map((book) => (
                            <li key={book.id} className="p-4 sm:p-6">
                                <div className="flex items-center sm:items-start">
                                    <div className="w-32">
                                        <div className="relative h-0 pb-2/3 pt-2/3">
                                            <img
                                                alt={`${book.title}`}
                                                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                                src={BOOK_IMAGE_URL + book.cover}
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-6 flex-1">
                                        <div
                                            className="font-medium text-gray-900 flex flex-col space-y-1">
                                            <h5 className="text-xl">{book.title}</h5>
                                            <p className="mt-2 sm:mt-0">
                                                ${toReadablePrice(book.priceInPennies)} <span className="text-xl">x {book.quantity}</span>
                                            </p>
                                            <div className="font-normal">
                                                <ReadMore text={book.overview} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order status */}
                                <div className="mt-6 sm:flex sm:justify-between">
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
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            );
            }
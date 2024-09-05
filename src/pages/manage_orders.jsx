import {useFetchOrdersQuery, useUpdateOrderStatusMutation} from "../features/orders/admin_orders_slice";
import {Link, useSearchParams} from "react-router-dom";
import {useConvertPrice, useParseDate} from "../app/helpers";
import Pagination from "../components/pagination";
import If from "../components/if";
import {USER_IMAGE_URL} from "../app/consts";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function ManageOrders() {
    const [params] = useSearchParams();

    const {data: orders, isLoading} = useFetchOrdersQuery({page: params.get("page"), size: params.get("size")});

    const toReadablePrice = useConvertPrice;
    const toReadableDate = useParseDate;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white rounded">
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">Orders</h1>
                        </div>
                    </div>
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle">
                                <table className="min-w-full border-separate border-spacing-0">
                                    <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                            Number
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                        >
                                            Price
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                                        >
                                            Is Paid
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            Created At
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            Ordered By
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                                        >
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.elements.map((order, orderIdx) => (
                                        <tr className="even:bg-gray-50" key={order.number}>
                                            <td
                                                className={classNames(
                                                    orderIdx !== orders.elements.length - 1 ? 'border-b border-gray-200' : '',
                                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8',
                                                )}
                                            >
                                                {order.number}
                                            </td>
                                            <td
                                                className={classNames(
                                                    orderIdx !== orders.elements.length - 1 ? 'border-b border-gray-200' : '',
                                                    'hidden whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800 sm:table-cell',
                                                )}
                                            >
                                                ${toReadablePrice(order.priceInPennies)}
                                            </td>
                                            <td
                                                className={classNames(
                                                    orderIdx !== orders.elements.length - 1 ? 'border-b border-gray-200' : '',
                                                    'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell',
                                                )}
                                            >
                                                <If condition={order.isPaid}>
                                                    <span
                                                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-green-700 bg-green-100">
                                                    Yes
                                                  </span>
                                                </If>

                                                <If condition={!order.isPaid}>
                                                    <span
                                                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-red-700 bg-red-100">
                                                    No
                                                  </span>
                                                </If>
                                            </td>
                                            <td
                                                className={classNames(
                                                    orderIdx !== orders.elements.length - 1 ? 'border-b border-gray-200' : '',
                                                    'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                                                )}
                                            >
                                                <If condition={order.status === "Pending"}>
                                                    <span
                                                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100">
                                                    {order.status}
                                                  </span>
                                                </If>

                                                <If condition={order.status === "Shipped"}>
                                                    <span
                                                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100">
                                                    {order.status}
                                                  </span>
                                                </If>

                                                <If condition={order.status === "Delivered"}>
                                                    <span
                                                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-green-700 bg-green-100">
                                                    {order.status}
                                                  </span>
                                                </If>

                                                <If condition={order.status === "Canceled"}>
                                                    <span
                                                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-red-700 bg-red-100">
                                                    {order.status}
                                                  </span>
                                                </If>
                                            </td>
                                            <td
                                                className={classNames(
                                                    orderIdx !== orders.elements.length - 1 ? 'border-b border-gray-200' : '',
                                                    'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                                                )}
                                            >
                                                {toReadableDate(order.createdAt)}
                                            </td>
                                            <td
                                                className={classNames(
                                                    orderIdx !== orders.elements.length - 1 ? 'border-b border-gray-200' : '',
                                                    'hidden whitespace-nowrap px-3 py-4 text-xs text-gray-900 lg:table-cell',
                                                )}
                                            >
                                                <div className="flex space-x-1 items-center">
                                                    <img className="w-8 h-8 rounded-full hover:rounded-sm hover:scale-[2] transform transition-transform duration-150 object-cover"
                                                         src={USER_IMAGE_URL + order.user.picture}
                                                         alt={order.user.firstName}/>
                                                    <span>{order.user.firstName} {order.user.lastName}</span>
                                                </div>
                                            </td>
                                            <td
                                                className={classNames(
                                                    orderIdx !== orders.elements.length - 1 ? 'border-b border-gray-200' : '',
                                                    'relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-8 lg:pr-8',
                                                )}
                                            >
                                                <Link to={`/manage/orders/${order.id}`}
                                                      className="text-indigo-600 hover:text-indigo-900">
                                                    View<span className="sr-only">, {order.number}</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <Pagination {...orders} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import {Link, useNavigate, useParams} from "react-router-dom";
import {booksApi, useFetchBookQuery} from "../features/books/books_slice";
import {useDeleteBookMutation} from "../features/books/admin_book_slice";
import {
    DialogTitle,
    Disclosure,
    TabGroup,
    TabPanel,
} from '@headlessui/react'
import {BOOK_IMAGE_URL, USER_IMAGE_URL} from "../app/consts";
import {useEffect, useState} from "react";
import Rating from "../components/rating";
import ReadMore from "../components/readmore";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import Modal from "../components/modal";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import {useAddToCartMutation} from "../features/cart/cart_slice";
import {InformationCircleIcon} from "@heroicons/react/20/solid";


export default function ShowBook() {

    const {book: bookId} = useParams();

    const {data: book, isFetching} = useFetchBookQuery(bookId);

    const authorities = useAppSelector((state) => state.auth.authorities);

    const [addToCart, {isLoading: isAddingToCart}] = useAddToCartMutation();

    const navigate = useNavigate();
    const myAddToCart = (id) => {
        addToCart({id});
        navigate("/cart");
    };

    useEffect(() => {
        if (!isFetching)
            document.title = book.title + " | Bookstore";
    }, [isFetching]);

    const [deleteBookModal, setDeleteBookModal] = useState(false);

    const [deleteBook, {isSuccess: isDeleteSuccess, isLoading: isDeleteLoading}] = useDeleteBookMutation();

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isDeleteSuccess) {

            setTimeout(() => {
                dispatch(booksApi.util.resetApiState());

                setDeleteBookModal(false);

                navigate("/");
            }, 2000);
        }
    }, [isDeleteSuccess]);

    return (
        <div className="bg-white relative">
            {authorities.includes("ADMIN") && (
                <div className="absolute right-0 top-0 mr-3 mt-5 space-x-3 ">
                    <Link
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        to={`/books/${bookId}/edit`}>
                        Edit Book
                    </Link>

                    <button
                        type="button"
                        onClick={() => setDeleteBookModal(true)}
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        to={`/books/${bookId}/edit`}>
                        Delete Book
                    </button>

                    <Modal open={deleteBookModal} onClose={() => setDeleteBookModal(false)}>
                        <div>
                            <div className="sm:flex sm:items-start">
                                <div
                                    className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600"/>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3"
                                                 className="text-base font-semibold leading-6 text-gray-900">
                                        Delete book
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete this book? All data associated with this
                                            book will
                                            be permanently removed from
                                            our servers forever. This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                {
                                    isDeleteSuccess ? (
                                        <div
                                            className="flex items-center justify-center w-full rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-800 shadow-sm sm:ml-3 sm:w-auto">
                                            Book deleted successfully
                                        </div>
                                    ) : <>
                                        <button
                                            type="button"
                                            onClick={() => deleteBook(bookId)}
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        >
                                            {isDeleteLoading ? 'Deleting...' : 'Delete'}
                                        </button>
                                        <button
                                            type="button"
                                            data-autofocus
                                            onClick={() => setDeleteBookModal(false)}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                }
                            </div>
                        </div>
                    </Modal>
                </div>
            )}
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
                    {/* Image gallery */}
                    <TabGroup className="flex flex-col-reverse md:flex-col col-span-4">
                        <TabPanel>
                            {
                                book == null || isFetching ? (
                                    <div className="h-[30rem] bg-gray-300 animate-pulse"/>
                                ) : (
                                    <img
                                        alt={book.title}
                                        src={BOOK_IMAGE_URL + book.cover}
                                        className="h-[30rem] w-auto mx-auto object-center sm:rounded-lg"
                                    />
                                )
                            }
                        </TabPanel>

                        {book != null && !isFetching && book.purchased && !book.wroteReview && (
                            <div className="mx-auto max-w-lg">
                                <div className="rounded-md bg-blue-50 p-4 my-4 w-full">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <InformationCircleIcon aria-hidden="true"
                                                                   className="h-5 w-5 text-blue-400"/>
                                        </div>
                                        <div className="ml-3 flex-1 md:flex items-center md:justify-between">
                                            <p className="text-sm text-blue-700">
                                                You have already purchased this book.
                                            </p>
                                            <p className="mt-3 text-sm md:ml-6 md:mt-0">
                                                <Link to={`/reviews/${book.id}`}
                                                      className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                                                    Write a Review
                                                    <span aria-hidden="true"> &rarr;</span>
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )}
                    </TabGroup>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 col-span-8">
                        {
                            book == null || isFetching ? (
                                <>
                                    <div className="h-6 w-1/2 bg-gray-300 animate-pulse"/>
                                    <div className="h-6 w-1/2 bg-gray-300 animate-pulse"/>
                                    <div className="h-6 w-1/2 bg-gray-300 animate-pulse"/>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{book.title}</h1>
                                    <h1 className="font-bold tracking-tight text-gray-500">{book.author}</h1>
                                    <h1 className="text-sm font-semibold tracking-tight text-gray-500">{book.genre}</h1>
                                </>
                            )
                        }

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            {
                                book == null || isFetching ? (
                                    <div className="h-6 w-1/4 bg-gray-300 animate-pulse"/>
                                ) : (
                                    <p className="text-3xl tracking-tight text-gray-900">${Math.floor(book.priceInPennies / 100)}.{String(book.priceInPennies % 100).padStart(2, '0')}</p>
                                )
                            }
                        </div>

                        {/* Reviews */}
                        <div className="mt-3">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className={isFetching ? 'animate-pulse' : ''}>
                                    <Rating rating={isFetching ? 0 : book.averageRating}/>
                                </div>
                                <p className="sr-only">
                                    {isFetching ? 'Loading' : book.averageRating} out of 5 stars
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Overview</h3>

                            {
                                book == null || isFetching ? (
                                    <div className="h-12 w-1/2 bg-gray-300 animate-pulse"/>
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{__html: book.overview}}
                                        className="space-y-6 text-base text-gray-700"
                                    />
                                )
                            }

                        </div>

                        {
                            !isFetching && book && book.quantity > 0 && (
                                <div className="mt-10 flex">
                                    <button
                                        type="button"
                                        onClick={() => myAddToCart(book.id)}
                                        className="mx-auto sm:mx-0 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                                    >
                                        {isAddingToCart ? "Adding..." : "Add to cart"}
                                    </button>
                                </div>
                            )
                        }

                        {!isFetching && book && book.quantity === 0 && (
                            <div className="mt-10">
                                <p className="text-red-500 font-semibold">Out of stock</p>
                            </div>
                        )}


                        <section aria-labelledby="details-heading" className="mt-12">
                            {!isFetching && book && book.reviews.length > 0 && (
                                <h2 id="details-heading"
                                    className="text-lg font-semibold text-gray-800">Reviews</h2>
                            )}

                            <div className="divide-y divide-gray-200 border-t">
                                {!isFetching && book && book.reviews.map((review) => (
                                    <Disclosure key={review.id} as="div">
                                        <div className="flex my-2">
                                            <div className="mr-4 flex-shrink-0 mt-2">
                                                <img
                                                    className="h-10 w-10 rounded-full border border-gray-300"
                                                    src={USER_IMAGE_URL + review.user.picture}
                                                    alt={review.user.firstName}
                                                />
                                            </div>
                                            <div className="w-full">
                                                <div className="flex items-center justify-between w-full">
                                                    <h4 className="text-gray-600 font-bold">{review.user.firstName} {review.user.lastName}</h4>
                                                    <Rating rating={review.rating}/>
                                                </div>
                                                <div className="mt-1">
                                                    <ReadMore text={review.body} maxLength={100}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Disclosure>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
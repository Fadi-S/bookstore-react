import {useParams} from "react-router-dom";
import {useFetchBookQuery} from "../features/books/books_slice";
import {
    TabGroup,
    TabPanel,
} from '@headlessui/react'
import {StarIcon} from '@heroicons/react/20/solid'
import {BOOK_IMAGE_URL} from "../app/consts";
import {useEffect} from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ShowBook() {

    const {book: bookId} = useParams();

    const {data: book, isFetching} = useFetchBookQuery(bookId);

    useEffect(() => {
        if(!isFetching)
            document.title = book.title + " | Bookstore";
    }, [isFetching]);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                    {/* Image gallery */}
                    <TabGroup className="flex flex-col-reverse">
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
                    </TabGroup>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
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
                                <div className={["flex items-center", isFetching ? 'animate-pulse' : '']}>
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            aria-hidden="true"
                                            className={classNames(
                                                (isFetching ? 0 : book.averageRating) > rating ? 'text-indigo-500' : 'text-gray-300',
                                                'h-5 w-5 flex-shrink-0',
                                            )}
                                        />
                                    ))}
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

                        <form className="mt-6">

                            <div className="mt-10 flex">
                                <button
                                    type="submit"
                                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                                >
                                    Add to cart
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
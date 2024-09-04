import {Link, useParams} from "react-router-dom";
import {useFetchBookQuery} from "../features/books/books_slice";
import {
    Disclosure,
    TabGroup,
    TabPanel,
} from '@headlessui/react'
import {BOOK_IMAGE_URL, USER_IMAGE_URL} from "../app/consts";
import {useEffect} from "react";
import Rating from "../components/rating";
import ReadMore from "../components/readmore";
import {useAppSelector} from "../app/hooks";


export default function ShowBook() {

    const {book: bookId} = useParams();

    const {data: book, isFetching} = useFetchBookQuery(bookId);

    const authorities = useAppSelector((state) => state.auth.authorities);

    useEffect(() => {
        if (!isFetching)
            document.title = book.title + " | Bookstore";
    }, [isFetching]);

    return (
        <div>
            <div className="bg-white relative">
                {authorities.includes("ADMIN") && (
                    <div className="absolute right-0 top-0 mr-3 mt-5">
                        <Link className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" to={`/books/${bookId}/edit`}>
                            Edit Book
                        </Link>
                    </div>
                )}
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
        </div>
    );
}
import React, {useCallback, useEffect, useState} from "react";
import {useFetchBooksQuery} from "../features/books/books_slice";
import {BOOK_IMAGE_URL} from "../app/consts";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useAddToCartMutation} from "../features/cart/cart_slice";
import {useAppDispatch} from "../app/hooks";
import {closeNotification, openLoginForm, showNotification} from "../features/page/page_slice";
import {handleAddToCart, notify} from "../app/helpers";


function renderEmptyStates(number = 3) {
    let items = [];
    for (let i = 0; i < number; i++) items.push(i);

    return items.map(i =>
        <div key={`item_${i}`} className="overflow-hidden rounded-lg bg-white shadow animate-pulse">
            <div className="px-4 py-5 sm:p-4">
                <div className="flex flex-col justify-between space-y-4">
                    <div className="relative h-0 pb-2/3 pt-2/3">
                        <img
                            alt="Default"
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                            src={BOOK_IMAGE_URL + "default"}
                        />
                    </div>
                    <div className="flex flex-col space-y-3">
                        <div className="h-4 bg-slate-300 rounded"></div>

                        <div className="h-2 bg-slate-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function renderBooks(books, addToCart) {
    return books.map(book => (
        <div key={book.id} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-4 h-full">
                <div className="flex flex-col justify-between space-y-4 h-full">
                    <Link className="group" to={`/books/${book.id}`}>
                        <div className="relative h-0 pb-2/3 pt-2/3">
                            <img
                                alt={`${book.title}`}
                                className="absolute inset-0 w-full h-full object-cover rounded-lg transform transition-transform
                                    duration-200 group-hover:scale-110"
                                src={BOOK_IMAGE_URL + book.cover}
                            />
                        </div>
                        <div className="flex flex-col items-start mt-3">
                            <h3 className="text-xl text-blue-700">
                                {book.title}
                            </h3>
                            <div className="text-sm font-semibold text-gray-500 mt-0.5">{book.author}</div>
                            <div className="flex items-start text-gray-800 mt-2">
                                <span className="text-sm">$</span>
                                <span
                                    className="text-2xl font-semibold">{Math.floor(book.priceInPennies / 100)}</span>
                                <span className="text-sm mr-0.5">
                                    {String(book.priceInPennies % 100).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </Link>

                    <div className="mt-2">
                        {book && book.isOutOfStock ? (
                            <p className="text-red-500 font-semibold">Out of stock</p>
                        ) : (
                            <button
                                type="button" onClick={() => addToCart(book.id)}
                                className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                            >
                                Add to Cart
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    ));
}

export default function BooksIndex() {
    const [page, setPage] = useState(1);
    const [allBooks, setAllBooks] = useState([]);
    const {data = [], isFetching} = useFetchBooksQuery({size: 12, page: page});

    const handleScroll = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 150 && !isFetching && page < data.totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isFetching]);

    useEffect(() => {
        if (data?.elements?.length) {
            setAllBooks((prevBooks) => [...prevBooks, ...data.elements]);
        }
    }, [data]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Clean up when component unmounts
    }, [handleScroll]);


    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [addToCart, {isLoading: isAddingToCart, error: errorAddingToCart, isSuccess: addedSuccessfully}] = useAddToCartMutation();
    useEffect(
        () => handleAddToCart(dispatch, errorAddingToCart, addedSuccessfully, navigate),
        [isAddingToCart]
    );

    const myAddToCart = (id) => addToCart({id});

    if (isFetching && allBooks == null) {
        return (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {renderEmptyStates(6)}
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {renderBooks(allBooks, myAddToCart)}
            {isFetching && (
                <div className="flex justify-center w-full">
                    <div className="w-6 h-6 border-2 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
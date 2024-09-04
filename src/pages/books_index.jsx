import React from "react";
import {useFetchBooksQuery} from "../features/books/books_slice";
import {BOOK_IMAGE_URL} from "../app/consts";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useAddToCartMutation} from "../features/cart/cart_slice";


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
                        <button type="button" onClick={() => addToCart(book.id)}>
                                <span className="text-sm font-semibold text-blue-700">
                                    Add to Cart
                                </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ));
}

export default function BooksIndex() {
    const [searchParams] = useSearchParams();
    let [size, page] = [parseInt(searchParams.get("size")), parseInt(searchParams.get("page"))];
    const {data = [], isFetching} = useFetchBooksQuery([size, page]);


    const [addToCart, {isLoading: isAddingToCart}] = useAddToCartMutation();

    const navigate = useNavigate();
    const myAddToCart = (id) => {
        addToCart({id});
        navigate("/cart");
    };

    if (isFetching || data == null) {
        size = !size ? 4 : Math.min(size, 12);
        return (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                {renderEmptyStates(size)}
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
            {renderBooks(data, myAddToCart)}
        </div>
    );
}
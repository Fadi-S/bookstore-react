import React from "react";
import { useFetchBooksQuery } from "../features/books/books_slice";
import { IMAGE_URL } from "../app/consts";


function renderEmptyStates(number=3) {
    let items = [];
    for (let i=0; i<number; i ++) items.push(1);

    return items.map(_ =>
        <div className="overflow-hidden rounded-lg bg-white shadow animate-pulse">
            <div className="px-4 py-5 sm:p-6">
                <div className="h-64">
                    <img className="thum" src={IMAGE_URL + "default"} />
                </div>
            </div>
        </div>
    );
}

function renderBooks(books) {
    return books.map(book => (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
                <div className="h-64">
                    <img className="thum" src={IMAGE_URL + book.cover} />
                    {book.title}
                </div>
            </div>
        </div>
    ));
}

export default function BooksIndex() {
    const {data = [], isFetching} = useFetchBooksQuery();

    if (isFetching || data == null) {
        return (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
                {renderEmptyStates(4)}
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
            {renderBooks(data)}
        </div>
    );
}
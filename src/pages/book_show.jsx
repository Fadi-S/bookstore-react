import React from 'react';
import { useParams } from "react-router-dom";
import { useFetchBookQuery } from "../features/books/books_slice";

export default function ShowBook() {
    const { book } = useParams();

    const {data, isFetching} = useFetchBookQuery(book);

    return (
        <div className="">
            {data.title}
        </div>
    );
}
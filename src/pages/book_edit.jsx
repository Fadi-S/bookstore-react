import {useUpdateBookMutation} from "../features/books/admin_book_slice";
import {booksApi, useFetchBookQuery} from "../features/books/books_slice";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {useNavigate, useParams} from "react-router-dom";
import BookForm from "../components/book_form";

export default function EditBook() {

    const authorities = useAppSelector((state) => state.auth.authorities);
    const navigate = useNavigate();
    const params = useParams();

    const [updateBook, {error, isSuccess, isLoading}] = useUpdateBookMutation();
    const {data: book, isFetching} = useFetchBookQuery(params.book);

    useEffect(() => {
        if (!authorities.includes("ADMIN")) {
            navigate("/");
        }
    }, []);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isSuccess) {
            dispatch(booksApi.util.resetApiState());
        }
    }, [isSuccess]);

    if(isFetching) {
        return <p>Loading...</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-12 sm:py-8">
                <h1 className="text-3xl font-bold">Edit Book</h1>
                <BookForm
                    initialValues={{
                        id: book.id,
                        title: book.title,
                        genre: book.genre,
                        author: book.author,
                        price: book.price,
                        quantity: book.quantity,
                        overview: book.overview,
                        cover: null,
                    }}
                    onSubmit={updateBook}
                    error={error}
                    isLoading={isLoading}
                    isSuccessful={isSuccess}
                />
            </div>
        </div>
    );
}
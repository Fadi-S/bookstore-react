import {useCreateBookMutation} from "../features/books/admin_book_slice";
import {useEffect} from "react";
import {useAppSelector} from "../app/hooks";
import {useNavigate} from "react-router-dom";
import BookForm from "../components/book_form";

export default function CreateBook() {

    const authorities = useAppSelector((state) => state.auth.authorities);
    const navigate = useNavigate();

    const [createBook, {error, isSuccess, data : book, isLoading}] = useCreateBookMutation();

    useEffect(() => {
        if (!authorities.includes("ADMIN")) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (isSuccess) {
            navigate("/books/" + book.id);
        }
    }, [isSuccess]);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-12 sm:py-8">
                <h1 className="text-3xl font-bold">Create a Book</h1>
                <BookForm
                    onSubmit={createBook}
                    error={error}
                    isLoading={isLoading}
                    isSuccessful={isSuccess}
                />
            </div>
        </div>
    );
}
import {useCreateBookMutation} from "../features/books/admin_book_slice";
import {useEffect} from "react";
import {useAppSelector} from "../app/hooks";
import {useNavigate} from "react-router-dom";
import {Form} from "react-final-form";
import MyField from "../components/MyField";

export default function CreateBook() {

    const authorities = useAppSelector((state) => state.auth.authorities);
    const navigate = useNavigate();

    const [createBook, {error, isSuccess, data, isLoading}] = useCreateBookMutation();

    useEffect(() => {
        if (!authorities.includes("ADMIN")) {
            navigate("/");
        }
    }, []);

    const errors = error?.data.message.errors;

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-12 sm:py-8">
                <h1 className="text-3xl font-bold">Create a Book</h1>
                <Form onSubmit={createBook} render={({handleSubmit}) => (
                    <form className="mt-4" onSubmit={handleSubmit} encType="multipart/form-data">
                        <div
                            className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
                            <MyField
                                label="Title"
                                name="title"
                                id="title"
                                type="text"
                                error={errors?.title}
                            />

                            <MyField
                                label="Author"
                                name="author"
                                id="author"
                                type="text"
                                error={errors?.author}
                            />

                            <MyField
                                label="Genre"
                                name="genre"
                                id="genre"
                                type="text"
                                error={errors?.genre}
                            />

                            <MyField
                                label="Cover"
                                name="cover"
                                id="cover"
                                type="file"
                                error={errors?.cover}
                            />

                            <MyField
                                label="Price"
                                name="price"
                                id="price"
                                type="number"
                                error={errors?.price}
                            />

                            <MyField
                                className="col-span-2"
                                label="Overview"
                                name="overview"
                                rows={6}
                                id="overview"
                                component="textarea"
                                error={errors?.title}
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Create Book
                        </button>
                    </form>
                )}/>
            </div>
        </div>
    );
}
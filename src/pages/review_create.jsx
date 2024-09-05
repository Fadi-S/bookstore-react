import {useCreateReviewMutation} from "../features/books/reviews_slice";
import {booksApi, useFetchBookQuery} from "../features/books/books_slice";
import {Field, Form} from "react-final-form";
import MyField from "../components/MyField";
import {useNavigate, useParams} from "react-router-dom";
import {BOOK_IMAGE_URL} from "../app/consts";
import React, {useEffect} from "react";
import {StarIcon} from "@heroicons/react/20/solid";
import {closeNotification, showNotification} from "../features/page/page_slice";
import {useAppDispatch} from "../app/hooks";

export default function CreateReview() {

    const [createReview, {isSuccess, isLoading, error}] = useCreateReviewMutation();

    const { book: bookId } = useParams();
    const {data: book} = useFetchBookQuery(bookId);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isSuccess) {
            dispatch(showNotification({title: "Success", message: 'Review created successfully', type: 'success', show: true}));
            setTimeout(() => {
                dispatch(closeNotification());
            }, 3000);

            dispatch(booksApi.util.resetApiState())

            navigate(`/books/${bookId}`);
        }
    }, [isSuccess]);

    return (
        <div className="bg-white relative">
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-3xl lg:px-8">
                <h2 className="text-xl font-semibold">Create Review</h2>

                <div className="mt-8">
                    <Form
                        mutators={{
                            setRating: ([field, value], state, utils) => {
                                utils.changeValue(state, 'rating', () => value)
                            },
                        }}
                        onSubmit={(values) => createReview({bookId, ...values})}
                          render={({handleSubmit, form}) => (
                        <form onSubmit={handleSubmit}>

                            <div className="flex flex-col space-y-10 divide-y divide-gray-300">

                                {book && (
                                    <div className="flex items-start justify-start space-x-6">
                                        <div className="w-32">
                                            <div className="relative h-0 pb-2/3 pt-2/3">
                                                <img
                                                    alt={`${book.title}`}
                                                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                                    src={BOOK_IMAGE_URL + book.cover}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold">{book.title}</h3>
                                            <p className="text-sm text-gray-600">{book.author}</p>
                                            <p className="text-sm text-gray-600">{book.genre}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Field
                                        name="rating"
                                        id="rating"
                                        component="select"
                                        className="hidden"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Field>

                                    <h4 className="text-lg font-semibold text-gray-800">Rating</h4>
                                    <div className="flex items-center mt-3">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <button
                                                key={'rating-' + rating}
                                                    type="button"
                                                className="group"
                                                onClick={() => form.mutators.setRating('rating', rating+1)}
                                            >
                                                <span className="sr-only">Rating {rating}</span>

                                                <StarIcon
                                                    aria-hidden="true"
                                                    className={ (form.getFieldState('rating')?.value > rating ? 'text-indigo-500' : 'text-gray-300') + ' h-8 w-8 flex-shrink-0'}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <MyField
                                    className="mt-6"
                                    name="body"
                                    id="body"
                                    label="Write your review"
                                    placeholder="Did you like the book? Would you recommend it?"
                                    component="textarea"
                                    rows={6}
                                />
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                          )}/>
                </div>
            </div>
        </div>
    );
}
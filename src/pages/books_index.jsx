import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useFetchBooksQuery} from "../features/books/books_slice";
import {BOOK_IMAGE_URL} from "../app/consts";
import {Link, useNavigate} from "react-router-dom";
import {useAddToCartMutation} from "../features/cart/cart_slice";
import {useAppDispatch} from "../app/hooks";
import {handleAddToCart} from "../app/helpers";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import {ChevronDownIcon, XMarkIcon} from '@heroicons/react/20/solid'
import {ShoppingCartIcon} from "@heroicons/react/24/solid";
import If from "../components/if";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";


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

    if(books.length === 0) {
        return (
            <div className="col-span-12 mt-8">
                <div className="overflow-hidden rounded-lg bg-white shadow max-w-2xl mx-auto">
                    <div className="px-4 py-5 sm:p-4 h-full">
                        <div className="text-center">
                            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400"/>
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No Books found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try changing your search criteria</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return books.map(book => (
        <div key={`book-${book.id}`} className="overflow-hidden rounded-lg bg-white shadow">
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
                            <div className="text-sm font-semibold text-gray-500 mt-0.5">{book.genre}</div>
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
                                type="button"
                                onClick={() => addToCart(book.id)}
                                className="inline-flex text-center justify-center items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <ShoppingCartIcon aria-hidden="true" className="-ml-0.5 h-5 w-5"/>
                                <span>Add to Cart</span>
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    ));
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function BooksIndex() {
    const [page, setPage] = useState(1);
    const [allBooks, setAllBooks] = useState([]);
    const searchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(searchParams.entries());
    const sort = searchParams.get('sort');
    const size = searchParams.get('size') || 12;
    const [search, setSearch] = useState(searchParams.get('search') || "");

    const isFirstRender = useRef(true);

    useEffect(() => {
        const debounceTimer = setTimeout(() =>{
            const url = window.location.pathname;
            const params = new URLSearchParams(window.location.search);

            if(search)
                params.set('search', search);
            else
                params.delete('search');

            navigate(`${url}?${params.toString()}`);

            if(!isFirstRender.current) {
                resetPagination();
            }
            isFirstRender.current = false;
        }, 500);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [search]);


    const {data = [], isFetching} = useFetchBooksQuery({size, page, params});

    const [filters, setFilters] = useState([]);
    useEffect(() => {
        if (!data.authors || !data.genres) return;

        let tempFilters = [
            {
                id: 'filters[author]',
                name: 'Author',
                options: data.authors.map(author => ({value: author, label: author, checked: false}))
            },
            {
                id: 'filters[genre]',
                name: 'Genre',
                options: data.genres.map(genre => ({value: genre, label: genre, checked: false}))
            }
        ];

        const params = new URLSearchParams(window.location.search);
        tempFilters.map(section => {
            section.options.forEach(
                option => option.checked = !!params.get(section.id)?.split(',').includes(option.value)
            );
        });

        setFilters(tempFilters);
    }, [data.authors, data.genres]);




    const activeFilters = useMemo(() => {
        if (!filters || !filters.length) return [];

        return filters.map((section) =>
            section.options.filter(option => option.checked).map((option) => ({
                value: option.value,
                label: option.label,
                section: section.id,
            }))
        ).flat();
    }, [filters]);
    //useState([{value: 'objects', label: 'Objects'}]);

    const lastMerged = useRef(0);
    // Function to reset pagination when filters change
    const resetPagination = useCallback(() => {
        setPage(1);
        setAllBooks([]);
        lastMerged.current = 0;
    }, []);

    // Handle filters change (watch the URL params for changes)
    useEffect(resetPagination, [sort, resetPagination])

    const handleScroll = useCallback(() => {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 150 && !isFetching && page < data.books.totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isFetching, page, lastMerged, data]);

    useEffect(() => {
        if (data?.books?.elements?.length && lastMerged.current !== page) {
            setAllBooks((prevBooks) => [...prevBooks, ...data.books.elements]);
            lastMerged.current = page;
        }
    }, [data]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Clean up when component unmounts
    }, [handleScroll]);

    const navigate = useNavigate();
    const handleFilters = ({name, value, checked}) => {
        const filter = filters.find(section => section.id === name);
        const option = filter.options.find(option => option.value === value);

        option.checked = checked;
        setFilters([...filters]);

        const filterParams = {};
        filters.forEach((section) => {
            let value = section.options.filter(option => option.checked).map(option => option.value).join(',');

            if (value)
                filterParams[section.id] = value;
            }
        );

        const url = window.location.pathname;
        const params = new URLSearchParams(filterParams);

        const existingParams = new URLSearchParams(window.location.search);
        for (let key of existingParams.keys()) {
            if (key.startsWith('filters[')) {
                continue;
            }
            params.set(key, existingParams.get(key));
        }

        navigate(`${url}?${params.toString()}`);

        resetPagination();
    }

    const dispatch = useAppDispatch();
    const [addToCart, {
        isLoading: isAddingToCart,
        error: errorAddingToCart,
        isSuccess: addedSuccessfully
    }] = useAddToCartMutation();
    useEffect(
        () => handleAddToCart(dispatch, errorAddingToCart, addedSuccessfully, navigate),
        [isAddingToCart]
    );

    const myAddToCart = (id) => addToCart({id});

    const url = window.location.pathname;
    const buildPageUrl =
        (key, value) => {
            const existingParams = new URLSearchParams(window.location.search);
            existingParams.delete(key);

            return `${url}?${new URLSearchParams([...existingParams, [key, value]]).toString()}`;
        };

    const sortOptions = useMemo(() => [
        {name: 'Newest', href: buildPageUrl('sort', '-id'), current: sort === '-id'},
        {name: 'Cheapest', href: buildPageUrl('sort', 'price_in_pennies'), current: sort === 'price_in_pennies'},
        {
            name: 'Most Expensive',
            href: buildPageUrl('sort', '-price_in_pennies'),
            current: sort === '-price_in_pennies'
        },
        {name: 'Most Popular', href: buildPageUrl('sort', '-popularity'), current: sort === '-popularity'},
    ], [sort, filters, resetPagination]);

    const [open, setOpen] = useState(false)


    if (isFetching && allBooks == null) {
        return (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {renderEmptyStates(6)}
            </div>
        );
    }

    return (
        <div>
            <div className="bg-white">
                {/* Mobile filter dialog */}
                <Dialog open={open} onClose={setOpen} className="relative z-40 sm:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                    />

                    <div className="fixed inset-0 z-40 flex">
                        <DialogPanel
                            transition
                            className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
                        >
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon aria-hidden="true" className="h-6 w-6"/>
                                </button>
                            </div>

                            {/* Filters */}
                            <form className="mt-4">
                                {filters.map((section) => (

                                    <Disclosure key={`mobile-${section.name}`} as="div"
                                                className="border-t border-gray-200 px-4 py-6">
                                        <h3 className="-mx-2 -my-3 flow-root">
                                            <DisclosureButton
                                                className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                                                <span className="font-medium text-gray-900">{section.name}</span>
                                                <span className="ml-6 flex items-center">
                                                    <ChevronDownIcon
                                                        aria-hidden="true"
                                                        className="h-5 w-5 rotate-0 transform group-data-[open]:-rotate-180"
                                                    />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pt-6">
                                            <div className="space-y-6">
                                                {section.options.map((option, optionIdx) => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            onChange={(event) => handleFilters(event.target)}
                                                            defaultValue={option.value}
                                                            defaultChecked={option.checked}
                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                            name={`${section.id}`}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <label
                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                            className="ml-3 text-sm text-gray-500"
                                                        >
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </DisclosurePanel>
                                    </Disclosure>
                                ))}
                            </form>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Filters */}
                <section aria-labelledby="filter-heading">
                    <h2 id="filter-heading" className="sr-only">
                        Filters
                    </h2>

                    <div className="border-b border-gray-200 bg-white">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                            <Menu as="div" className="relative inline-block text-left my-4">
                                <div>
                                    <MenuButton
                                        className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sort <span
                                        className="ml-0.5 text-xs hidden sm:block">{' '}{sortOptions.find((option) => option.current)?.name}</span>
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        />
                                    </MenuButton>
                                </div>

                                <MenuItems
                                    transition
                                    className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.name}>
                                                <Link
                                                    to={option.href}
                                                    className={classNames(
                                                        option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                        'block px-4 py-2 text-sm data-[focus]:bg-gray-100',
                                                    )}
                                                >
                                                    {option.name}
                                                </Link>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>

                            <div className="w-full h-full py-0 my-0 mx-4">
                                <input
                                    type="search"
                                    placeholder="Search"
                                    className="block w-full border-0 focus:border-b focus:ring-0 focus:outline-none focus:border-gray-500 sm:text-sm"
                                    value={search}
                                    onInput={(event) => setSearch(event.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                            >
                                Filters
                            </button>

                            <div className="hidden sm:block my-4">
                                <div className="flow-root">
                                    <PopoverGroup className="-mx-4 flex items-center divide-x divide-gray-200">
                                        {filters.map((section) => (
                                            <Popover key={`desk-${section.id}`}
                                                     className="relative inline-block px-4 text-left">
                                                <PopoverButton
                                                    className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                                    <span>{section.name}</span>
                                                    {section.options.filter(option => option.checked).length > 0 && (
                                                        <span
                                                            className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                                                            {section.options.filter(option => option.checked).length}
                                                          </span>
                                                    )}
                                                    <ChevronDownIcon
                                                        aria-hidden="true"
                                                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                    />
                                                </PopoverButton>

                                                <PopoverPanel
                                                    transition
                                                    className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                                >
                                                    <form className="space-y-4">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input
                                                                    onChange={(event) => handleFilters(event.target)}
                                                                    defaultValue={option.value}
                                                                    defaultChecked={option.checked}
                                                                    id={`filter-${section.id}-${optionIdx}`}
                                                                    name={`${section.id}`}
                                                                    type="checkbox"
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                    className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </form>
                                                </PopoverPanel>
                                            </Popover>
                                        ))}
                                    </PopoverGroup>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active filters */}
                    <If replacement={(<div className="my-4"></div>)} condition={activeFilters.length > 0}>
                        <div className="bg-gray-100">
                            <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Filters
                                    <span className="sr-only">, active</span>
                                </h3>

                                <div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"/>

                                <div className="mt-2 sm:ml-4 sm:mt-0">
                                    <div className="-m-1 flex flex-wrap items-center">
                                        {activeFilters.map((activeFilter) => (
                                            <span
                                                key={activeFilter.value}
                                                className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
                                            >
                                            <span>{activeFilter.label}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleFilters({name: activeFilter.section, value: activeFilter.label, checked: false})}
                                                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                            >
                                              <span className="sr-only">Remove filter for {activeFilter.label}</span>
                                              <svg fill="none" stroke="currentColor" viewBox="0 0 8 8"
                                                   className="h-2 w-2">
                                                <path d="M1 1l6 6m0-6L1 7" strokeWidth="1.5" strokeLinecap="round"/>
                                              </svg>
                                            </button>
                                          </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </If>
                </section>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {renderBooks(allBooks, myAddToCart)}
                {isFetching && (
                    <div className="flex justify-center w-full">
                        <div
                            className="w-6 h-6 border-2 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>

    )
        ;
}
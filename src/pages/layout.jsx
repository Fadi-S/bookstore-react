import React, {useEffect, useState} from "react";
import {Link, Outlet, useLocation } from "react-router-dom";

import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import Modal from "../components/modal";
import {clearAuth, useLogoutMutation} from "../features/authentication/authentication_slice";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import Authentication from "../components/authentication";
import {USER_IMAGE_URL} from "../app/consts";
import logo from "../logo.svg";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Layout() {

    const [open, setOpen] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const [navigation, setNavigation] = useState([
        {name: 'Home', href: '/', current: false},
        {name: 'Team', href: '#', current: false},
        {name: 'Projects', href: '#', current: false},
        {name: 'Calendar', href: '#', current: false},
    ]);

    const location = useLocation();

    useEffect(() => {
        setNavigation(navigation.map((item) => {
            item.current = window.location.pathname === item.href;
            return item;
        }));

        const titles = {
            '/': 'Home',
            '/profile': 'Profile',
        };
        document.title = titles[window.location.pathname] ? titles[window.location.pathname] + " | Bookstore" : 'Bookstore';
    }, [location]);

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const [logoutUser] = useLogoutMutation();

    const onLogout = () => {
        logoutUser({});
        dispatch(clearAuth());
    };

    const userNavigation = [
        {name: 'Your Profile', href: '/profile'},
        {name: 'Sign out', onClick: onLogout},
    ];

    return (
        <>
            <div className="min-h-full">
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <Authentication showRegister={showRegister} onSuccess={() => setOpen(false)}/>
                </Modal>
                <Disclosure as="nav" className="bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        alt="Your Company"
                                        src={logo}
                                        className="block h-8 w-auto lg:hidden"
                                    />
                                    <img
                                        alt="Your Company"
                                        src={logo}
                                        className="hidden h-8 w-auto lg:block"
                                    />
                                </div>
                                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={classNames(
                                                item.current
                                                    ? 'border-indigo-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                {user == null && (
                                    <div className="space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {setOpen(true); setShowRegister(false)}}
                                            className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                                        >
                                            Sign In
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {setOpen(true); setShowRegister(true)}}
                                            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                )}
                                {
                                    user != null && (
                                        <Menu as="div" className="relative ml-3">
                                            <div>
                                                <MenuButton
                                                    className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                    <span className="absolute -inset-1.5"/>
                                                    <span className="sr-only">Open user menu</span>
                                                    <img alt="" src={USER_IMAGE_URL + user.picture} className="h-8 w-8 rounded-full"/>
                                                </MenuButton>
                                            </div>
                                            <MenuItems
                                                transition
                                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                            >
                                                {userNavigation.map((item) => (
                                                    <MenuItem key={item.name}>
                                                        {
                                                            item.onClick == null ?
                                                                (<Link to={item.href}
                                                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                                                        {item.name}
                                                                    </Link>
                                                                ) : (
                                                                    <button onClick={item.onClick}
                                                                            className="block px-4 py-2 text-start text-sm text-gray-700 data-[focus]:bg-gray-100 w-full">
                                                                        {item.name}</button>
                                                                )
                                                        }

                                                    </MenuItem>
                                                ))}
                                            </MenuItems>
                                        </Menu>
                                    )
                                }
                            </div>
                            <div className="-mr-2 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <DisclosureButton
                                    className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <span className="absolute -inset-0.5"/>
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon aria-hidden="true"
                                               className="block h-6 w-6 group-data-[open]:hidden"/>
                                    <XMarkIcon aria-hidden="true"
                                               className="hidden h-6 w-6 group-data-[open]:block"/>
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as={Link}
                                    to={item.href}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}

                            {user == null && (
                                <DisclosureButton
                                    key={"login"}
                                    as="button"
                                    className='border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50
                                        hover:text-gray-800 block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                                >
                                    Sign in
                                </DisclosureButton>
                            )}
                        </div>
                        {
                            user != null && (
                                <div className="border-t border-gray-200 pb-3 pt-4">
                                    <div className="flex items-center px-4">
                                        <div className="flex-shrink-0">
                                            <img alt="" src={USER_IMAGE_URL + user.picture} className="h-10 w-10 rounded-full"/>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        {userNavigation.map((item) => (
                                            <DisclosureButton
                                                key={item.name}
                                                as={Link}
                                                to={item.href}
                                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                            >
                                                {item.name}
                                            </DisclosureButton>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </DisclosurePanel>
                </Disclosure>

                <div className="py-10">
                    <main>
                        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                            <Outlet/>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

import React from "react";
import {
    Navbar,
    Collapse,
    Typography,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { Link, NavLink } from "react-router-dom";

import NotificationCenter from "../features/NotificationCenter";
import { useTheme } from "../../contexts/ThemeContext";

export default function StickyNavbar({ onLogout }) {
    const [openNav, setOpenNav] = React.useState(false);
    const { theme, toggleTheme } = useTheme();

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
                variant="small"
                className="p-1 font-normal text-blue-gray-900 dark:text-blue-400"
            >
                <NavLink to="/" className={({ isActive }) => isActive ? "flex items-center text-blue-500 font-bold" : "flex items-center"}>
                    Dashboard
                </NavLink>
            </Typography>
            <Typography
                as="li"
                variant="small"
                className="p-1 font-normal text-blue-gray-900 dark:text-blue-400"
            >
                <NavLink to="/customers" className={({ isActive }) => isActive ? "flex items-center text-blue-500 font-bold" : "flex items-center"}>
                    Customers
                </NavLink>
            </Typography>
            <Typography
                as="li"
                variant="small"
                className="p-1 font-normal text-blue-gray-900 dark:text-blue-400"
            >
                <NavLink to="/about" className={({ isActive }) => isActive ? "flex items-center text-blue-500 font-bold" : "flex items-center"}>
                    About Us
                </NavLink>
            </Typography>
            <Typography
                as="li"
                variant="small"
                className="p-1 font-normal text-blue-gray-900 dark:text-blue-400"
            >
                <NavLink to="/contact" className={({ isActive }) => isActive ? "flex items-center text-blue-500 font-bold" : "flex items-center"}>
                    Contact Us
                </NavLink>
            </Typography>
            <Typography
                as="li"
                variant="small"
                className="p-1 font-normal text-blue-gray-900 dark:text-blue-400"
            >
                <NavLink to="/requests" className={({ isActive }) => isActive ? "flex items-center text-blue-500 font-bold" : "flex items-center"}>
                    Requests
                </NavLink>
            </Typography>
        </ul>
    );

    return (
        <div className="max-h-[768px] w-full">
            <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 dark:bg-gray-900 dark:border-b dark:border-gray-800">
                <div className="flex items-center justify-between text-blue-gray-900">
                    <Typography
                        as={Link}
                        to="/"
                        className="mr-4 cursor-pointer py-1.5 font-medium text-blue-gray-900 dark:text-blue-400"
                    >
                        Spark<span className="text-blue-500 font-bold dark:text-blue-300">CRM</span>
                    </Typography>
                    <div className="flex items-center gap-4">
                        <div className="mr-4 hidden lg:block">{navList}</div>
                        <div className="flex items-center gap-x-1">

                            <div className="mr-2">
                                <NotificationCenter />
                            </div>
                            <IconButton variant="text" onClick={toggleTheme} color={theme === 'dark' ? 'white' : 'blue-gray'}>
                                {theme === 'dark' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                    </svg>
                                )}
                            </IconButton>

                            <Button
                                variant="gradient"
                                size="sm"
                                className="hidden lg:inline-block"
                                onClick={onLogout}
                            >
                                <span>Log Out</span>
                            </Button>
                        </div>
                        <IconButton
                            variant="text"
                            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                            ripple={false}
                            onClick={() => setOpenNav(!openNav)}
                        >
                            {openNav ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </IconButton>
                    </div>
                </div>
                <Collapse open={openNav} className="dark:bg-gray-900">
                    {navList}
                    <div className="flex items-center gap-x-1">
                        <Button fullWidth variant="text" onClick={toggleTheme} className="flex items-center justify-center gap-2 dark:text-blue-400">
                            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        </Button>
                        <Button fullWidth variant="gradient" size="sm" onClick={onLogout}>
                            <span>Log Out</span>
                        </Button>
                    </div>
                </Collapse>
            </Navbar>
        </div>
    );
}

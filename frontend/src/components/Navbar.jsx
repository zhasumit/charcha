import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { BellIcon, DoorOpen, Rabbit } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { logoutMutation } = useLogout()

    const handleLogoutClick = () => {
        setIsModalOpen(true);
    };

    const confirmLogout = () => {
        logoutMutation({
            onSuccess: () => {
                setIsModalOpen(false);
            },
        });
    };


    const cancelLogout = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-full">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2.5">
                        {isChatPage && (
                            <>
                                <Rabbit className="w-7 h-7 text-primary transition-transform duration-300 hover:scale-110" />
                                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider select-none">
                                    Charcha
                                </span>
                            </>
                        )}
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Avatar */}
                        <div className="avatar cursor-pointer transition-transform duration-200 hover:scale-105">
                            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-sm">
                                <img
                                    src={authUser?.profilePic}
                                    alt="User Avatar"
                                    loading="lazy"
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Notifications button */}
                        <Link to="/notifications">
                            <button
                                className="btn btn-ghost btn-circle btn-lg hover:bg-base-200 hover:text-base-content transition-colors duration-200 group"
                                aria-label="Notifications"
                            >
                                <BellIcon className="h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </Link>
                        <ThemeSelector />

                        {/* Logout button */}
                        <button
                            className="btn btn-ghost btn-circle btn-lg hover:bg-base-200 hover:text-base-content transition-colors duration-200 group"
                            onClick={handleLogoutClick}
                            aria-label="Logout"
                        >
                            <DoorOpen className="h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>


                    </div>
                </div>
            </nav>

            {/* Inline Minimal Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
                    <div className="backdrop-blur-sm bg-white/80 dark:bg-base-100/80 border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-md w-[260px] text-center">
                        <p className="mb-3 text-sm font-medium text-gray-800 dark:text-gray-100">
                            Are you sure you want to logout?
                        </p>
                        <div className="flex justify-center gap-3 mt-2">
                            <button
                                onClick={cancelLogout}
                                className="btn btn-outline btn-xs"
                                aria-label="Cancel logout"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="btn btn-primary btn-xs"
                                aria-label="Confirm logout"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;

import React, { useEffect, useRef, useState } from "react";
import { FiMenu, FiSearch, FiBell, FiMail, FiSun } from "react-icons/fi";
import ProfileCard from "./ProfileCard";

const Topbar = ({ onMenuClick, isSidebarOpen }) => {

    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
            <div className="flex items-center">
                <button
                    onClick={onMenuClick}
                    className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:mr-4"
                    aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    <FiMenu className="text-xl" />
                </button>
                <h1 className="text-lg font-semibold text-slate-800 md:text-xl">
                    {isSidebarOpen ? '' : 'Dashboard'}
                </h1>
            </div>

            <div className="relative mx-4 flex-1 max-w-2xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiSearch className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full rounded-lg border-0 bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 transition-colors duration-200
             outline-none focus:outline-none focus:border-0
             focus:ring-2 focus:ring-blue-500"
                />

            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                    <FiSun className="h-5 w-5" />
                    <span className="sr-only">Toggle theme</span>
                </button>

                <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                    <FiMail className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500">
                        <span className="absolute -inset-1 animate-ping rounded-full bg-red-500 opacity-75"></span>
                    </span>
                    <span className="sr-only">View notifications</span>
                </button>

                <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                    <FiBell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                    <span className="sr-only">View messages</span>
                </button>

                <div className="relative" ref={profileRef}>
                    {/* Avatar */}
                    <div
                        className="ml-2 h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-white bg-blue-100 shadow-sm"
                        onClick={() => setShowProfile(prev => !prev)}
                    >
                        <div className="flex h-full items-center justify-center text-sm font-medium text-blue-600">
                            JD
                        </div>
                    </div>

                    {/* Dropdown */}
                    {showProfile && (
                        <div className="absolute right-0 top-12 z-50">
                            <ProfileCard />
                        </div>
                    )}
                </div>



            </div>
        </header>
    );
}

function IconBtn({ children, dot }) {
    return (
        <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100">
            {dot && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />}
            {children}
        </button>
    );
}


export default Topbar;
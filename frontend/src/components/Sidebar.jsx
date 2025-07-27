import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router'
import { BellIcon, HomeIcon, Rabbit, UsersIcon } from 'lucide-react'

const Sidebar = () => {
    const { authUser, isLoading } = useAuthUser()
    const location = useLocation()
    const currentPath = location.pathname

    const navItems = [
        { to: '/', label: 'Home', icon: HomeIcon },
        { to: '/friends', label: 'Friends', icon: UsersIcon },
        { to: '/notifications', label: 'Notifications', icon: BellIcon }
    ]

    return (
        <aside className="w-56 bg-base-100 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 shadow-sm">
            {/* Logo/Header */}
            <div className="px-4 py-4.5 border-b border-base-200 flex items-center gap-2">
                <Rabbit className="size-7 text-primary" />
                <span className="text-xl font-semibold tracking-tight">Charcha</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ to, label, icon: Icon }) => {
                    const isActive = currentPath === to
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                                ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-base-200 hover:text-base-content'
                                }`}
                        >
                            <Icon
                                className={`size-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : 'opacity-70'}`}
                            />
                            <span className="truncate">{label}</span>
                        </Link>
                    )
                })}
            </nav>

            {!isLoading && authUser && (
                <div className="p-2 border-t border-base-200 mt-auto bg-base-100">
                    <div className="flex items-center gap-3 transition-all duration-200 hover:bg-base-200/70 rounded-md p-2 cursor-pointer">

                        {/* Avatar with online pulse */}
                        <div className="avatar relative">
                            <div className="w-10 rounded-full ring ring-success ring-offset-base-100 ring-offset-2 transition-transform duration-200 hover:scale-105 shadow-sm">
                                <img
                                    src={authUser.profilePic}
                                    alt="User Avatar"
                                    className="object-cover"
                                />
                            </div>
                            {/* Pulsing green online dot */}
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-base-100 rounded-full animate-ping"></span>
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-base-100 rounded-full"></span>
                        </div>

                        {/* User info */}
                        <div className="flex flex-col justify-center overflow-hidden">
                            <p className="text-sm font-medium text-ellipsis whitespace-nowrap overflow-hidden">
                                {authUser.fullName}
                            </p>
                            <p className="text-[10px] text-green-600/70 font-semibold">Online</p>

                        </div>
                    </div>
                </div>
            )}

        </aside>
    )
}

export default Sidebar

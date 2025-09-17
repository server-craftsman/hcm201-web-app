'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    ChartBarIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Button } from '@/shared/components/ui'
import { useAuthContext } from '@/modules/auth'
import { cn } from '@/shared/utils/shadcn'
import logo from '@/shared/assets/images/logo.png'

const navigation = [
    { name: 'Trang chủ', href: '/', icon: HomeIcon },
    { name: 'Tranh luận', href: '/debates', icon: ChatBubbleLeftRightIcon },
    { name: 'Học tập', href: '/study', icon: AcademicCapIcon },
]

export const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const { user, isAuthenticated, logout } = useAuthContext()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <nav className={cn(
            "sticky top-0 z-50 transition-all duration-500 ease-out",
            "backdrop-blur-xl bg-white/80 border-b border-red-200/50",
            "shadow-lg shadow-red-500/10",
            isScrolled && "bg-white/95 shadow-xl shadow-red-500/20 border-red-300/60"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-4 group">
                        <div className="relative w-16 h-12 bg-gradient-to-br from-red-600 via-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:shadow-xl group-hover:shadow-red-500/40 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-2 group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:via-red-400 group-hover:to-red-600">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={64}
                                height={48}
                                className="object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
                            />
                            {/* Animated shine effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
                            {/* Pulse effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-600 to-red-600 opacity-0 group-hover:opacity-20 animate-pulse transition-opacity duration-300" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-2xl text-red-500 font-bold transition-colors duration-300 group-hover:text-gray-700">Tư tưởng Hồ Chí Minh</h1>
                            <p className="text-sm text-gray-600 font-medium transition-colors duration-300 group-hover:text-gray-700">
                                Nền tảng học tập và thảo luận chuyên nghiệp
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigation.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 ease-out hover:bg-red-50/80 hover:shadow-md hover:shadow-red-500/10 hover:scale-105 hover:-translate-y-0.5"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <item.icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-red-600" />
                                <span className="transition-all duration-300 group-hover:font-semibold">{item.name}</span>
                                {/* Active indicator */}
                                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full transition-all duration-300 group-hover:w-3/4 group-hover:left-1/4" />
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <Link
                                href="/dashboard"
                                className="group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 ease-out hover:bg-red-50/80 hover:shadow-md hover:shadow-red-500/10 hover:scale-105 hover:-translate-y-0.5"
                            >
                                <ChartBarIcon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-red-600" />
                                <span className="transition-all duration-300 group-hover:font-semibold">Bảng điều khiển</span>
                                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full transition-all duration-300 group-hover:w-3/4 group-hover:left-1/4" />
                            </Link>
                        )}
                    </div>

                    {/* User menu */}
                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-white/80 to-red-50/60 backdrop-blur-lg rounded-2xl border border-red-200/50 shadow-md shadow-red-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:rotate-3">
                                        <UserCircleIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 transition-colors duration-300">Chào {user?.displayName}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="group relative flex items-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-lg border border-red-200/50 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 ease-out hover:bg-red-50/80 hover:shadow-md hover:shadow-red-500/10 hover:scale-105 hover:-translate-y-0.5"
                                >
                                    <ArrowRightOnRectangleIcon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-red-600" />
                                    <span className="hidden sm:inline transition-all duration-300 group-hover:font-semibold">Đăng xuất</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href="/login">
                                    <button className="group relative flex items-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 ease-out hover:bg-red-50/80 hover:shadow-md hover:shadow-red-500/10 hover:scale-105 hover:-translate-y-0.5">
                                        <span className="transition-all duration-300 group-hover:font-semibold">Đăng nhập</span>
                                    </button>
                                </Link>
                                <Link href="/register">
                                    <button className="group relative flex items-center space-x-2 px-4 py-2.5 bg-red-600 rounded-xl text-sm font-medium text-white shadow-lg shadow-red-500/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 hover:-translate-y-0.5 hover:from-red-400 hover:to-red-500">
                                        <span className="transition-all duration-300 group-hover:font-semibold">Đăng ký</span>
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden group relative flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-xl text-gray-700 hover:text-red-600 transition-all duration-300 ease-out hover:bg-red-50/80 hover:shadow-md hover:shadow-red-500/10 hover:scale-110 hover:rotate-90"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <div className="relative w-6 h-6">
                                <Bars3Icon className={cn(
                                    "absolute inset-0 h-6 w-6 transition-all duration-300 ease-out",
                                    isMobileMenuOpen ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"
                                )} />
                                <XMarkIcon className={cn(
                                    "absolute inset-0 h-6 w-6 transition-all duration-300 ease-out",
                                    isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"
                                )} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={cn(
                    "md:hidden overflow-hidden transition-all duration-500 ease-out",
                    isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}>
                    <div className="border-t border-red-200/50 mt-4 pt-4 pb-4">
                        <div className="px-2 space-y-1">
                            {navigation.map((item, index) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/80 backdrop-blur-lg transition-all duration-300 ease-out hover:translate-x-2 hover:shadow-md hover:shadow-red-500/10"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:text-red-600" />
                                    <span className="transition-all duration-300 group-hover:font-semibold">{item.name}</span>
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <Link
                                    href="/dashboard"
                                    className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/80 backdrop-blur-lg transition-all duration-300 ease-out hover:translate-x-2 hover:shadow-md hover:shadow-red-500/10"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <ChartBarIcon className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:text-red-600" />
                                    <span className="transition-all duration-300 group-hover:font-semibold">Bảng điều khiển</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
'use client'

import React, { useState } from 'react'
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
import { Button } from '@/shared/components/ui'
import { useAuthContext } from '@/modules/auth'
import { cn } from '@/shared/utils/shadcn'
// import { motion } from 'framer-motion' // Will be added when framer-motion is installed

const navigation = [
    { name: 'Trang chủ', href: '/', icon: HomeIcon },
    { name: 'Tranh luận', href: '/debates', icon: ChatBubbleLeftRightIcon },
    { name: 'Học tập', href: '/study', icon: AcademicCapIcon },
]

export const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, isAuthenticated, logout } = useAuthContext()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <nav className="glass-luxury border-b border-white/20 sticky top-0 z-50 shadow-luxury">
            <div className="container-luxury">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-4 group">
                        <div className="relative w-14 h-14 hcm-gradient-luxury rounded-2xl flex items-center justify-center shadow-luxury group-hover:shadow-premium transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                            <span className="text-white font-bold text-2xl font-serif">H</span>
                            {/* Shine effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="hcm-text-gradient-luxury font-bold text-2xl font-serif">
                                Tranh luận Tư tưởng HCM
                            </h1>
                            <p className="text-sm text-neutral-600 font-medium">
                                Nền tảng học tập và thảo luận chuyên nghiệp
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="nav-link-luxury"
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <Link
                                href="/dashboard"
                                className="nav-link-luxury"
                            >
                                <ChartBarIcon className="h-5 w-5" />
                                <span>Bảng điều khiển</span>
                            </Link>
                        )}
                    </div>

                    {/* User menu */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-white/60 backdrop-blur-lg rounded-2xl border border-white/30">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                                        <UserCircleIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-neutral-700">Chào {user?.displayName}</span>
                                </div>
                                <Button
                                    variant="glass"
                                    size="sm"
                                    onClick={handleLogout}
                                    leftIcon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                                >
                                    <span className="hidden sm:inline">Đăng xuất</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href="/login">
                                    <Button variant="glass" size="sm">
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="luxury" size="sm" shimmer>
                                        Đăng ký
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="glass"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-white/20 mt-4 pt-4">
                        <div className="px-2 pb-4 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-white/60 backdrop-blur-lg transition-all duration-300 hover:translate-x-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="h-6 w-6" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-white/60 backdrop-blur-lg transition-all duration-300 hover:translate-x-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <ChartBarIcon className="h-6 w-6" />
                                    <span>Bảng điều khiển</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    PlusCircleIcon,
    DocumentTextIcon,
    HeartIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
    SparklesIcon,
    TrophyIcon
} from '@heroicons/react/24/outline'
// Layout riêng biệt không sử dụng FriendlyNavbar
import { cn } from '@/shared/utils/shadcn'
import { useAuthContext } from '@/modules/auth'

interface UserLayoutProps {
    children: React.ReactNode
}

const navigationItems = [
    {
        name: 'Trang chủ',
        href: '/',
        icon: HomeIcon,
        gradient: 'from-blue-500 to-indigo-600',
        description: 'Khám phá nội dung mới'
    },
    {
        name: 'Tranh luận',
        href: '/debates',
        icon: ChatBubbleLeftRightIcon,
        gradient: 'from-purple-500 to-pink-600',
        description: 'Tham gia thảo luận'
    },
    {
        name: 'Học tập',
        href: '/study',
        icon: AcademicCapIcon,
        gradient: 'from-green-500 to-emerald-600',
        description: 'Học và luyện tập'
    },
    {
        name: 'Yêu cầu chủ đề',
        href: '/debates/request',
        icon: PlusCircleIcon,
        gradient: 'from-orange-500 to-red-600',
        description: 'Đề xuất chủ đề mới'
    }
]

const quickActions = [
    {
        name: 'Dashboard',
        href: '/my-dashboard',
        icon: UserCircleIcon,
        color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
        name: 'Luận điểm của tôi',
        href: '/my-arguments',
        icon: DocumentTextIcon,
        color: 'bg-green-50 text-green-600 hover:bg-green-100'
    },
    {
        name: 'Bình chọn của tôi',
        href: '/my-votes',
        icon: HeartIcon,
        color: 'bg-red-50 text-red-600 hover:bg-red-100'
    },
    {
        name: 'Thành tích',
        href: '/achievements',
        icon: TrophyIcon,
        color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
    }
]

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()
    const { user, logout } = useAuthContext()

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(href)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Mobile Sidebar Toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-40 lg:hidden bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-blue-100"
            >
                {isSidebarOpen ? (
                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                ) : (
                    <Bars3Icon className="h-6 w-6 text-gray-600" />
                )}
            </motion.button>

            {/* Sidebar */}
            <AnimatePresence>
                <motion.aside
                    initial={{ x: -280 }}
                    animate={{
                        x: 0,
                        width: isCollapsed ? 80 : 280
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className={cn(
                        "fixed left-0 top-0 bottom-0 z-30 bg-white/95 backdrop-blur-xl border-r border-blue-100/50 shadow-xl",
                        "lg:translate-x-0",
                        typeof window !== 'undefined' && (isSidebarOpen || !window.matchMedia('(max-width: 1024px)').matches) ? 'translate-x-0' : '-translate-x-full'
                    )}
                >
                    {/* Collapse Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-6 bg-white border border-blue-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <motion.div
                            animate={{ rotate: isCollapsed ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.div>
                    </motion.button>

                    <div className="p-6 h-full overflow-y-auto">
                        {/* Welcome Section */}
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-8"
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="bg-white/20 p-2 rounded-xl">
                                            <SparklesIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Chào mừng!</h3>
                                            <p className="text-blue-100 text-sm">Bắt đầu học tập ngay</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-3 mt-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span>Tiến độ học tập</span>
                                            <span className="font-bold">68%</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                            <motion.div
                                                className="bg-white h-2 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: '68%' }}
                                                transition={{ delay: 0.5, duration: 1 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Main Navigation */}
                        <div className="space-y-2 mb-8">
                            {!isCollapsed && (
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Điều hướng chính
                                </h4>
                            )}
                            {navigationItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center rounded-xl transition-all duration-300",
                                            isCollapsed ? "p-3" : "p-4",
                                            isActive(item.href)
                                                ? "bg-gradient-to-r " + item.gradient + " text-white shadow-lg"
                                                : "text-gray-700 hover:bg-gray-50"
                                        )}
                                        title={isCollapsed ? item.name : undefined}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center rounded-lg transition-all duration-300",
                                            isCollapsed ? "w-8 h-8" : "w-10 h-10 mr-4",
                                            isActive(item.href)
                                                ? "bg-white/20"
                                                : "bg-transparent group-hover:bg-white/80"
                                        )}>
                                            <item.icon className={cn(
                                                "transition-all duration-300",
                                                isCollapsed ? "h-5 w-5" : "h-6 w-6",
                                                isActive(item.href)
                                                    ? "text-white"
                                                    : "text-gray-500 group-hover:text-gray-700"
                                            )} />
                                        </div>
                                        {!isCollapsed && (
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm">{item.name}</h3>
                                                <p className={cn(
                                                    "text-xs mt-0.5",
                                                    isActive(item.href)
                                                        ? "text-white/80"
                                                        : "text-gray-500"
                                                )}>
                                                    {item.description}
                                                </p>
                                            </div>
                                        )}
                                        {isActive(item.href) && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                            {!isCollapsed && (
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Truy cập nhanh
                                </h4>
                            )}
                            {quickActions.map((action, index) => (
                                <motion.div
                                    key={action.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (navigationItems.length + index) * 0.1 }}
                                >
                                    <Link
                                        href={action.href}
                                        className={cn(
                                            "flex items-center rounded-xl transition-all duration-300",
                                            isCollapsed ? "p-3 justify-center" : "p-3",
                                            action.color
                                        )}
                                        title={isCollapsed ? action.name : undefined}
                                    >
                                        <action.icon className={cn(
                                            "transition-all duration-300",
                                            isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
                                        )} />
                                        {!isCollapsed && (
                                            <span className="font-medium text-sm">{action.name}</span>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* User Info Section */}
                        <div className="mt-auto pt-6 border-t border-blue-100">
                            {!isCollapsed && user ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">
                                                {user.firstName ? `${user.firstName} ${user.lastName}`.trim() : user.username}
                                            </p>
                                            <p className="text-xs text-gray-600">👨‍🎓 Người dùng</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={logout}
                                        className="w-full flex items-center justify-center p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Đăng xuất
                                    </motion.button>
                                </motion.div>
                            ) : isCollapsed && user ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center space-y-2"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={logout}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Đăng xuất"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </motion.button>
                                </motion.div>
                            ) : null}
                        </div>
                    </div>
                </motion.aside>
            </AnimatePresence>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
                />
            )}

            {/* Main Content */}
            <main className={cn(
                "transition-all duration-300",
                isCollapsed ? "lg:ml-20" : "lg:ml-[280px]"
            )}>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}

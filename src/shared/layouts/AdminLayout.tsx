'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    ChartBarIcon,
    EyeIcon,
    CogIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    CheckCircleIcon,
    Bars3Icon,
    XMarkIcon,
    CommandLineIcon,
    ServerIcon,
    BoltIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/shared/utils/shadcn'
import { useAuthContext } from '@/modules/auth'

interface AdminLayoutProps {
    children: React.ReactNode
}

const navigationItems = [
    {
        name: 'Trang chủ',
        href: '/',
        icon: HomeIcon,
        gradient: 'from-blue-500 to-indigo-600',
        description: 'Tổng quan hệ thống'
    },
    // {
    //     name: 'Tranh luận',
    //     href: '/debates',
    //     icon: ChatBubbleLeftRightIcon,
    //     gradient: 'from-purple-500 to-pink-600',
    //     description: 'Các chủ đề tranh luận'
    // },
    // {
    //     name: 'Tác phẩm',
    //     href: '/ho-chi-minh/works',
    //     icon: AcademicCapIcon,
    //     gradient: 'from-green-500 to-emerald-600',
    //     description: 'Tác phẩm Hồ Chí Minh'
    // }
]

const adminItems = [
    {
        name: 'Bảng điều khiển',
        href: '/admin/dashboard',
        icon: ChartBarIcon,
        gradient: 'from-red-500 to-rose-600',
        description: 'Dashboard tổng quan',
        priority: 'high'
    },
    {
        name: 'Quản lý chủ đề',
        href: '/admin/threads',
        icon: ShieldCheckIcon,
        gradient: 'from-orange-500 to-red-600',
        description: 'Duyệt và phân công',
        badge: 8
    },
    {
        name: 'Quản lý người dùng',
        href: '/admin/users',
        icon: UserGroupIcon,
        gradient: 'from-pink-500 to-purple-600',
        description: 'User và phân quyền'
    },
    {
        name: 'Thống kê & Analytics',
        href: '/admin/analytics',
        icon: ChartBarIcon,
        gradient: 'from-cyan-500 to-blue-600',
        description: 'Báo cáo chi tiết'
    },
    {
        name: 'Giám sát hệ thống',
        href: '/monitoring',
        icon: EyeIcon,
        gradient: 'from-violet-500 to-purple-600',
        description: 'Theo dõi real-time'
    },
    {
        name: 'Cài đặt hệ thống',
        href: '/admin/settings',
        icon: CogIcon,
        gradient: 'from-gray-500 to-slate-600',
        description: 'Cấu hình toàn hệ thống'
    }
]

const systemStatus = [
    {
        name: 'Server Status',
        status: 'online',
        value: '99.9%',
        icon: ServerIcon
    },
    {
        name: 'Performance',
        status: 'good',
        value: '145ms',
        icon: BoltIcon
    },
    {
        name: 'Users Online',
        status: 'normal',
        value: '324',
        icon: UserGroupIcon
    },
    {
        name: 'Pending Tasks',
        status: 'warning',
        value: '12',
        icon: ExclamationTriangleIcon
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'online':
        case 'good':
            return 'text-green-600 bg-green-50'
        case 'normal':
            return 'text-blue-600 bg-blue-50'
        case 'warning':
            return 'text-orange-600 bg-orange-50'
        case 'error':
            return 'text-red-600 bg-red-50'
        default:
            return 'text-gray-600 bg-gray-50'
    }
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
            {/* Mobile Sidebar Toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-40 lg:hidden bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-red-100"
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
                    initial={{ x: -360 }}
                    animate={{
                        x: 0,
                        width: isCollapsed ? 80 : 360
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className={cn(
                        "fixed left-0 top-0 bottom-0 z-30 bg-white/95 backdrop-blur-xl border-r border-red-100/50 shadow-xl",
                        "lg:translate-x-0",
                        typeof window !== 'undefined' && (isSidebarOpen || !window.matchMedia('(max-width: 1024px)').matches) ? 'translate-x-0' : '-translate-x-full'
                    )}
                >
                    {/* Collapse Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-6 bg-white border border-red-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-shadow"
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
                        {/* Admin Command Center */}
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-8"
                            >
                                <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-6 text-white">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="bg-white/20 p-2 rounded-xl">
                                            <CommandLineIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Admin Control</h3>
                                            <p className="text-red-100 text-sm">Trạng thái: Toàn quyền</p>
                                        </div>
                                    </div>

                                    {/* System alert */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-white/10 rounded-xl p-3 flex items-center space-x-3"
                                    >
                                        <div className="bg-yellow-400/20 p-2 rounded-lg">
                                            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-300" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">8 chủ đề chờ duyệt</p>
                                            <p className="text-xs text-red-100">Cần phân công moderator</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* System Status */}
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-8"
                            >
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Trạng thái hệ thống
                                </h4>
                                <div className="space-y-2">
                                    {systemStatus.map((item, index) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", getStatusColor(item.status))}>
                                                    <item.icon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-600 capitalize">{item.status}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Main Navigation */}
                        <div className="space-y-2 mb-8">
                            {!isCollapsed && (
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Điều hướng chung
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
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Admin Tools */}
                        <div className="space-y-2">
                            {!isCollapsed && (
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Công cụ quản trị
                                </h4>
                            )}
                            {adminItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (navigationItems.length + index) * 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center rounded-xl transition-all duration-300",
                                            isCollapsed ? "p-3" : "p-4",
                                            isActive(item.href)
                                                ? "bg-gradient-to-r " + item.gradient + " text-white shadow-lg"
                                                : "text-gray-700 hover:bg-gray-50",
                                            item.priority === 'high' && !isActive(item.href) ? "ring-2 ring-red-200 bg-red-25" : ""
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
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-sm">{item.name}</h3>
                                                    {item.badge && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className={cn(
                                                                "px-2 py-0.5 rounded-full text-xs font-bold",
                                                                isActive(item.href)
                                                                    ? "bg-white/20 text-white"
                                                                    : "bg-red-100 text-red-600"
                                                            )}
                                                        >
                                                            {item.badge}
                                                        </motion.span>
                                                    )}
                                                    {item.priority === 'high' && (
                                                        <motion.div
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                isActive(item.href) ? "bg-white/60" : "bg-red-400"
                                                            )}
                                                        />
                                                    )}
                                                </div>
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
                                        {item.badge && isCollapsed && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                                            >
                                                {item.badge}
                                            </motion.div>
                                        )}
                                        {item.priority === 'high' && isCollapsed && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute -top-1 -left-1 w-3 h-3 bg-red-400 rounded-full"
                                            />
                                        )}
                                        {isActive(item.href) && (
                                            <motion.div
                                                layoutId="activeAdminTab"
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* User Info Section */}
                        <div className="mt-auto pt-6 border-t border-red-100">
                            {!isCollapsed && user ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl">
                                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {user.firstName?.charAt(0) || user.username?.charAt(0) || 'A'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">
                                                {user.firstName ? `${user.firstName} ${user.lastName}`.trim() : user.username}
                                            </p>
                                            <p className="text-xs text-gray-600">👑 Quản trị viên</p>
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
                                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {user.firstName?.charAt(0) || user.username?.charAt(0) || 'A'}
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
                isCollapsed ? "lg:ml-20" : "lg:ml-[360px]"
            )}>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}

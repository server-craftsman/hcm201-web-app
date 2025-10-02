'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    ClipboardDocumentListIcon,
    DocumentTextIcon,
    EyeIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    CheckCircleIcon,
    FlagIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/shared/utils/shadcn'
import { useAuthContext } from '@/modules/auth'

interface ModeratorLayoutProps {
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
    {
        name: 'Tranh luận',
        href: '/debates',
        icon: ChatBubbleLeftRightIcon,
        gradient: 'from-purple-500 to-pink-600',
        description: 'Các chủ đề tranh luận'
    },
    {
        name: 'Tác phẩm',
        href: '/ho-chi-minh/works',
        icon: AcademicCapIcon,
        gradient: 'from-green-500 to-emerald-600',
        description: 'Tác phẩm Hồ Chí Minh'
    }
]

const moderationItems = [
    {
        name: 'Hàng chờ kiểm duyệt',
        href: '/moderation/queue',
        icon: ClipboardDocumentListIcon,
        gradient: 'from-orange-500 to-red-600',
        description: 'Xử lý luận điểm',
        badge: 12
    },
    {
        name: 'Dashboard kiểm duyệt',
        href: '/moderation/dashboard',
        icon: ShieldCheckIcon,
        gradient: 'from-amber-500 to-orange-600',
        description: 'Thống kê cá nhân'
    },
    {
        name: 'Nhật ký kiểm duyệt',
        href: '/moderation/logs',
        icon: DocumentTextIcon,
        gradient: 'from-cyan-500 to-blue-600',
        description: 'Lịch sử hoạt động'
    },
    {
        name: 'Giám sát',
        href: '/monitoring',
        icon: EyeIcon,
        gradient: 'from-violet-500 to-purple-600',
        description: 'Theo dõi hệ thống'
    }
]

const quickStats = [
    {
        name: 'Chờ duyệt',
        value: '12',
        icon: ClockIcon,
        color: 'text-orange-600 bg-orange-50'
    },
    {
        name: 'Đã duyệt hôm nay',
        value: '8',
        icon: CheckCircleIcon,
        color: 'text-green-600 bg-green-50'
    },
    {
        name: 'Đã flag',
        value: '3',
        icon: FlagIcon,
        color: 'text-red-600 bg-red-50'
    },
    {
        name: 'Tỷ lệ duyệt',
        value: '85%',
        icon: ChartBarIcon,
        color: 'text-blue-600 bg-blue-50'
    }
]

export const ModeratorLayout: React.FC<ModeratorLayoutProps> = ({ children }) => {
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Mobile Sidebar Toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-40 lg:hidden bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-orange-100"
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
                    initial={{ x: -320 }}
                    animate={{
                        x: 0,
                        width: isCollapsed ? 80 : 320
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className={cn(
                        "fixed left-0 top-0 bottom-0 z-30 bg-white/95 backdrop-blur-xl border-r border-orange-100/50 shadow-xl",
                        "lg:translate-x-0",
                        typeof window !== 'undefined' && (isSidebarOpen || !window.matchMedia('(max-width: 1024px)').matches) ? 'translate-x-0' : '-translate-x-full'
                    )}
                >
                    {/* Collapse Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-6 bg-white border border-orange-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-shadow"
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
                        {/* Moderator Status */}
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-8"
                            >
                                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="bg-white/20 p-2 rounded-xl">
                                            <ShieldCheckIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Kiểm duyệt viên</h3>
                                            <p className="text-orange-100 text-sm">Trạng thái: Đang hoạt động</p>
                                        </div>
                                    </div>

                                    {/* Quick notification */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-white/10 rounded-xl p-3 flex items-center space-x-3"
                                    >
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <BellIcon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">12 luận điểm chờ duyệt</p>
                                            <p className="text-xs text-orange-100">Cần xử lý trong hôm nay</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Quick Stats */}
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-8"
                            >
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Thống kê nhanh
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickStats.map((stat, index) => (
                                        <motion.div
                                            key={stat.name}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                                        >
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", stat.color)}>
                                                <stat.icon className="h-4 w-4" />
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                                            <p className="text-xs text-gray-600">{stat.name}</p>
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

                        {/* Moderation Tools */}
                        <div className="space-y-2">
                            {!isCollapsed && (
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Công cụ kiểm duyệt
                                </h4>
                            )}
                            {moderationItems.map((item, index) => (
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
                                        {isActive(item.href) && (
                                            <motion.div
                                                layoutId="activeModerationTab"
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* User Info Section */}
                        <div className="mt-auto pt-6 border-t border-orange-100">
                            {!isCollapsed && user ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl">
                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {user.firstName?.charAt(0) || user.username?.charAt(0) || 'M'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">
                                                {user.firstName ? `${user.firstName} ${user.lastName}`.trim() : user.username}
                                            </p>
                                            <p className="text-xs text-gray-600">🛡️ Kiểm duyệt viên</p>
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
                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {user.firstName?.charAt(0) || user.username?.charAt(0) || 'M'}
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
                isCollapsed ? "lg:ml-20" : "lg:ml-[320px]"
            )}>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}

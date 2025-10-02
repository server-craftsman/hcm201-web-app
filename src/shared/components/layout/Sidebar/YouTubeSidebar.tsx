'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '@/modules/auth'
import { cn } from '@/shared/utils'
import {
    HomeIcon,
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    UsersIcon,
    BookOpenIcon,
    TrophyIcon,
    CogIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    BellIcon,
    HeartIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronRightIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline'

interface YouTubeSidebarProps {
    collapsed: boolean
    onToggleCollapsed: () => void
    isDrawer?: boolean
    onClose?: () => void
}

export const YouTubeSidebar: React.FC<YouTubeSidebarProps> = ({
    collapsed,
    onToggleCollapsed,
    isDrawer = false,
    onClose
}) => {
    const { user, isAuthenticated, logout } = useAuthContext()
    const pathname = usePathname()
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    // Main navigation items
    const mainNavigation = [
        {
            name: 'Trang chủ',
            href: '/',
            icon: HomeIcon,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            description: 'Khám phá nội dung mới'
        },
        {
            name: 'Tranh luận',
            href: '/debates',
            icon: ChatBubbleLeftRightIcon,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            description: 'Tham gia thảo luận'
        },
        {
            name: 'Tác phẩm',
            href: '/ho-chi-minh/works',
            icon: AcademicCapIcon,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            description: 'Tác phẩm Hồ Chí Minh'
        },
        {
            name: 'Học tập',
            href: '/ho-chi-minh/quiz',
            icon: UsersIcon,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            description: 'Quiz tư tưởng Hồ Chí Minh'
        }
    ]

    // User-specific navigation
    const getUserNavigation = () => {
        if (!isAuthenticated || !user) return []

        const baseItems = [
            {
                name: 'Hồ sơ',
                href: '/profile',
                icon: UserCircleIcon,
                color: 'text-slate-600 dark:text-slate-400',
                bgColor: 'bg-slate-50 dark:bg-slate-900/20'
            },
            // {
            //     name: 'Thông báo',
            //     href: '/notifications',
            //     icon: BellIcon,
            //     color: 'text-yellow-600 dark:text-yellow-400',
            //     bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
            // }
        ]

        switch (user.role?.toUpperCase()) {
            case 'ADMIN':
                return [
                    ...baseItems,
                    {
                        name: 'Dashboard Admin',
                        href: '/admin/dashboard',
                        icon: CogIcon,
                        color: 'text-red-600 dark:text-red-400',
                        bgColor: 'bg-red-50 dark:bg-red-900/20'
                    },
                    {
                        name: 'Quản lý chủ đề',
                        href: '/admin/threads',
                        icon: ShieldCheckIcon,
                        color: 'text-red-600 dark:text-red-400',
                        bgColor: 'bg-red-50 dark:bg-red-900/20'
                    },
                    {
                        name: 'Quản lý người dùng',
                        href: '/admin/users',
                        icon: UserGroupIcon,
                        color: 'text-red-600 dark:text-red-400',
                        bgColor: 'bg-red-50 dark:bg-red-900/20'
                    }
                ]
            case 'MODERATOR':
                return [
                    ...baseItems,
                    {
                        name: 'Dashboard kiểm duyệt',
                        href: '/moderation/dashboard',
                        icon: ShieldCheckIcon,
                        color: 'text-orange-600 dark:text-orange-400',
                        bgColor: 'bg-orange-50 dark:bg-orange-900/20'
                    },
                    {
                        name: 'Hàng chờ kiểm duyệt',
                        href: '/moderation/queue',
                        icon: ClipboardDocumentListIcon,
                        color: 'text-orange-600 dark:text-orange-400',
                        bgColor: 'bg-orange-50 dark:bg-orange-900/20'
                    }
                ]
            case 'USER':
            default:
                return [
                    ...baseItems,
                    {
                        name: 'Dashboard cá nhân',
                        href: '/my-dashboard',
                        icon: ChartBarIcon,
                        color: 'text-blue-600 dark:text-blue-400',
                        bgColor: 'bg-blue-50 dark:bg-blue-900/20'
                    }
                ]
        }
    }

    const userNavigation = getUserNavigation()

    const isActiveLink = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    const sidebarVariants = {
        expanded: { width: 280 },
        collapsed: { width: 72 },
        drawer: { width: 280 }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    }

    return (
        <>
            {/* Overlay for drawer mode */}
            {isDrawer && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                variants={sidebarVariants}
                animate={isDrawer ? 'drawer' : collapsed ? 'collapsed' : 'expanded'}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={cn(
                    "fixed left-0 top-0 bottom-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden",
                    isDrawer ? "lg:hidden" : "hidden lg:block"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">

                        {/* Toggle button */}
                        <button
                            onClick={isDrawer ? onClose : onToggleCollapsed}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isDrawer ? (
                                <XMarkIcon className="h-5 w-5" />
                            ) : (
                                <Bars3Icon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-4">
                        {/* Main Navigation */}
                        <div className="px-3 mb-6">
                            {!collapsed && !isDrawer && (
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="px-3 mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                >
                                    Chính
                                </motion.h3>
                            )}
                            <nav className="space-y-1">
                                {mainNavigation.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ delay: index * 0.05 }}
                                        onMouseEnter={() => setHoveredItem(item.name)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group relative flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                                                isActiveLink(item.href)
                                                    ? `${item.bgColor} ${item.color} shadow-md`
                                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                                                collapsed && !isDrawer ? "justify-center" : "justify-start"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-5 w-5 flex-shrink-0",
                                                !collapsed && !isDrawer ? "mr-3" : ""
                                            )} />

                                            {(!collapsed || isDrawer) && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}

                                            {/* Tooltip for collapsed state */}
                                            {collapsed && !isDrawer && hoveredItem === item.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50"
                                                >
                                                    {item.name}
                                                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                                                </motion.div>
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                        </div>

                        {/* User Navigation */}
                        {isAuthenticated && userNavigation.length > 0 && (
                            <div className="px-3 mb-6">
                                {!collapsed && !isDrawer && (
                                    <motion.h3
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="px-3 mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                    >
                                        Cá nhân
                                    </motion.h3>
                                )}
                                <nav className="space-y-1">
                                    {userNavigation.map((item, index) => (
                                        <motion.div
                                            key={item.name}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ delay: (mainNavigation.length + index) * 0.05 }}
                                            onMouseEnter={() => setHoveredItem(item.name)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "group relative flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                                                    isActiveLink(item.href)
                                                        ? `${item.bgColor} ${item.color} shadow-md`
                                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                                                    collapsed && !isDrawer ? "justify-center" : "justify-start"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "h-5 w-5 flex-shrink-0",
                                                    !collapsed && !isDrawer ? "mr-3" : ""
                                                )} />

                                                {(!collapsed || isDrawer) && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        {item.name}
                                                    </motion.span>
                                                )}

                                                {/* Tooltip for collapsed state */}
                                                {collapsed && !isDrawer && hoveredItem === item.name && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50"
                                                    >
                                                        {item.name}
                                                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                                                    </motion.div>
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* User Info & Logout */}
                    {isAuthenticated && user ? (
                        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                            {(!collapsed || isDrawer) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center space-x-3 mb-3"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.firstName || user.email}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {user.firstName?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                            {user.firstName || user.email}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                            {user.role?.toLowerCase() || 'user'}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            <button
                                onClick={logout}
                                className={cn(
                                    "w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors",
                                    collapsed && !isDrawer ? "justify-center" : "justify-start"
                                )}
                            >
                                <svg className={cn("h-5 w-5", !collapsed && !isDrawer ? "mr-3" : "")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {(!collapsed || isDrawer) && (
                                    <span>Đăng xuất</span>
                                )}
                            </button>
                        </div>
                    ) : null}
                </div>
            </motion.aside>
        </>
    )
}

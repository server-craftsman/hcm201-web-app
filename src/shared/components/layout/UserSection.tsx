'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    BellIcon,
    HeartIcon,
    CogIcon,
    ShieldCheckIcon,
    PlusCircleIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    UserGroupIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useAuthContext } from '@/modules/auth'
import { cn } from '@/shared/utils/shadcn'

const getUserMenuItemsByRole = (userRole: string | undefined) => {
    const baseItems = [
        { name: 'Hồ sơ cá nhân', href: '/profile', icon: UserCircleIcon, roles: ['USER', 'MODERATOR', 'ADMIN'] },
        { name: 'Thông báo', href: '/notifications', icon: BellIcon, roles: ['USER', 'MODERATOR', 'ADMIN'] },
    ]

    const roleSpecificItems = [
        // USER - Link đến dashboard riêng
        { name: 'Dashboard cá nhân', href: '/my-dashboard', icon: UserCircleIcon, roles: ['USER'] },
        { name: 'Chủ đề của tôi', href: '/my-threads', icon: PlusCircleIcon, roles: ['USER'] },
        { name: 'Luận điểm của tôi', href: '/my-arguments', icon: DocumentTextIcon, roles: ['USER'] },
        { name: 'Bình chọn của tôi', href: '/my-votes', icon: HeartIcon, roles: ['USER'] },

        // MODERATOR - Link đến dashboard kiểm duyệt
        { name: 'Dashboard kiểm duyệt', href: '/moderation/dashboard', icon: ShieldCheckIcon, roles: ['MODERATOR'] },
        { name: 'Hàng chờ kiểm duyệt', href: '/moderation/queue', icon: ClipboardDocumentListIcon, roles: ['MODERATOR'] },
        { name: 'Báo cáo nhanh', href: '/moderation/reports', icon: ExclamationTriangleIcon, roles: ['MODERATOR'] },

        // ADMIN - Link đến dashboard admin
        { name: 'Bảng điều khiển Admin', href: '/admin/dashboard', icon: CogIcon, roles: ['ADMIN'] },
        { name: 'Quản lý chủ đề', href: '/admin/threads', icon: ShieldCheckIcon, roles: ['ADMIN'] },
        { name: 'Quản lý người dùng', href: '/admin/users', icon: UserGroupIcon, roles: ['ADMIN'] },
    ]

    const allItems = [...baseItems, ...roleSpecificItems]

    return allItems.filter(item =>
        !userRole || item.roles.includes(userRole.toUpperCase())
    )
}

interface UserSectionProps {
    className?: string
}

export const UserSection: React.FC<UserSectionProps> = ({ className = "" }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const { user, isAuthenticated, logout } = useAuthContext()

    // Get user menu items dựa trên role
    const userMenuItems = getUserMenuItemsByRole(user?.role)

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsUserMenuOpen(false)
        }
        if (isUserMenuOpen) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [isUserMenuOpen])

    const handleLogout = async () => {
        try {
            await logout()
            setIsUserMenuOpen(false)
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Chào buổi sáng'
        if (hour < 18) return 'Chào buổi chiều'
        return 'Chào buổi tối'
    }

    const getUserDisplayName = () => {
        if (!user) return ''
        const firstName = user.firstName || ''
        const lastName = user.lastName || ''
        const fullName = `${firstName} ${lastName}`.trim()
        if (fullName && fullName !== '') {
            return fullName
        }
        return user.username || ''
    }

    // Helper to render avatar: show user.avatar if exists, else fallback to first letter
    const renderUserAvatar = (size: number, fontSize: string = "text-sm font-semibold") => {
        if (user && user.avatar) {
            return (
                <div
                    style={{
                        width: size,
                        height: size,
                        minWidth: size,
                        minHeight: size,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(to right, #60a5fa, #a78bfa)' // fallback bg
                    }}
                >
                    <Image
                        src={user.avatar}
                        alt={getUserDisplayName()}
                        width={size}
                        height={size}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            display: 'block'
                        }}
                    />
                </div>
            )
        }
        return (
            <div
                className={`w-${size} h-${size} bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white ${fontSize}`}
                style={{ width: size, height: size, minWidth: size, minHeight: size }}
            >
                {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return (
            <div className={cn("flex items-center space-x-3", className)}>
                <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
                >
                    Đăng nhập
                </Link>
                <Link
                    href="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white text-sm font-medium rounded-full hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Đăng ký
                </Link>
            </div>
        )
    }

    return (
        <div className={cn("relative", className)}>
            {/* User Menu Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                    e.stopPropagation()
                    setIsUserMenuOpen(!isUserMenuOpen)
                }}
                className="flex items-center space-x-3 p-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 transition-all duration-200 border border-blue-200/50 dark:border-blue-700/50 group cursor-pointer"
            >
                {/* Avatar */}
                <div className="relative">
                    {renderUserAvatar(32, "text-sm font-semibold")}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>

                {/* User Info */}
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {getGreeting()}, {getUserDisplayName()}!
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.role === 'ADMIN' ? (
                            <span className="text-red-500 font-medium">👑 Quản trị viên</span>
                        ) : user.role === 'MODERATOR' ? (
                            <span className="text-blue-500 font-medium">🛡️ Kiểm duyệt viên</span>
                        ) : user.role === 'USER' ? (
                            <span className="text-green-500 font-medium">👨‍🎓 Người dùng</span>
                        ) : (
                            <span className="text-gray-500 font-medium">👤 Khách</span>
                        )}
                    </p>
                </div>

                <motion.div
                    animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                    className="ml-2"
                >
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </motion.div>
            </motion.button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
                {isUserMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute z-[2147483647] right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl overflow-hidden"
                        style={{ zIndex: 2147483647 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* User Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b border-gray-100 dark:border-slate-700">
                            <div className="flex items-center space-x-3">
                                <div>
                                    {renderUserAvatar(48, "text-lg font-bold")}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{getUserDisplayName()}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                        <HeartIcon className="w-3 h-3 mr-1" />
                                        Hoạt động tích cực
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            {userMenuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <item.icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}

                            <hr className="my-2 border-gray-100 dark:border-slate-700" />

                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 w-full text-left"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

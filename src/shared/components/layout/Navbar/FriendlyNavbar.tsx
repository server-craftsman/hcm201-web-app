'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    BellIcon,
    MagnifyingGlassIcon,
    SunIcon,
    MoonIcon,
    HeartIcon,
    SparklesIcon,
    CogIcon,
    ShieldCheckIcon,
    PlusCircleIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    EyeIcon,
    FlagIcon,
    UserGroupIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useAuthContext } from '@/modules/auth'
import { cn } from '@/shared/utils/shadcn'
import logo from '@/shared/assets/images/logo.png'

// Default navigation cho guest users và public pages
const defaultNavigation = [
    {
        name: 'Trang chủ',
        href: '/',
        icon: HomeIcon,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 hover:bg-blue-100',
        description: 'Khám phá nội dung mới'
    },
    {
        name: 'Tranh luận',
        href: '/debates',
        icon: ChatBubbleLeftRightIcon,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50 hover:bg-purple-100',
        description: 'Tham gia thảo luận'
    },
    {
        name: 'Học tập',
        href: '/study',
        icon: AcademicCapIcon,
        color: 'text-green-500',
        bgColor: 'bg-green-50 hover:bg-green-100',
        description: 'Học và luyện tập'
    }
]

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
        // { name: 'Cài đặt hệ thống', href: '/admin/settings', icon: SparklesIcon, roles: ['ADMIN'] },
    ]

    const allItems = [...baseItems, ...roleSpecificItems]

    return allItems.filter(item =>
        !userRole || item.roles.includes(userRole.toUpperCase())
    )
}

interface FriendlyNavbarProps {
    showNavigation?: boolean
    className?: string
}

export const FriendlyNavbar: React.FC<FriendlyNavbarProps> = ({
    showNavigation = false,
    className = ""
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const { user, isAuthenticated, logout } = useAuthContext()

    // Get user menu items dựa trên role
    const userMenuItems = getUserMenuItemsByRole(user?.role)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsUserMenuOpen(false)
            setIsMobileMenuOpen(false)
        }
        if (isUserMenuOpen || isMobileMenuOpen) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [isUserMenuOpen, isMobileMenuOpen])

    const handleLogout = async () => {
        try {
            await logout()
            setIsUserMenuOpen(false)
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
        // TODO: Implement dark mode logic
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Chào buổi sáng'
        if (hour < 18) return 'Chào buổi chiều'
        return 'Chào buổi tối'
    }

    const getUserDisplayName = () => {
        if (!user) return ''
        return user.firstName ? `${user.firstName} ${user.lastName}`.trim() : user.username
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

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
                    : 'bg-white/80 backdrop-blur-md',
                className
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Brand */}
                    <motion.div
                        className="flex items-center space-x-4"
                        whileHover={{ scale: 1.02 }}
                    >
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full blur opacity-30"
                                />
                                <Image
                                    src={logo}
                                    alt="HCM201"
                                    width={40}
                                    height={40}
                                    className="relative rounded-full"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                                    HCM201
                                </h1>
                                <p className="text-xs text-gray-500">Tư tưởng Hồ Chí Minh</p>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    {showNavigation && (
                        <div className="hidden md:flex items-center space-x-2">
                            {defaultNavigation.map((item) => (
                                <motion.div key={item.name} whileHover={{ scale: 1.05 }}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                                            item.bgColor,
                                            item.color
                                        )}
                                        title={item.description}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Search Bar */}
                    {showNavigation && (
                        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài học, thảo luận..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>
                    )}

                    {/* Spacer cho trường hợp không có navigation */}
                    {!showNavigation && <div className="flex-1"></div>}

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        >
                            {isDarkMode ? (
                                <SunIcon className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <MoonIcon className="h-5 w-5 text-gray-600" />
                            )}
                        </motion.button>

                        {isAuthenticated && user ? (
                            <div className="relative">
                                {/* User Menu Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsUserMenuOpen(!isUserMenuOpen)
                                    }}
                                    className="flex items-center space-x-3 p-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 border border-blue-200/50"
                                >
                                    {/* Avatar */}
                                    <div className="relative">
                                        {renderUserAvatar(32, "text-sm font-semibold")}
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                    </div>

                                    {/* User Info */}
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-800">
                                            {getGreeting()}, {getUserDisplayName()}!
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
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
                                            className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-xl overflow-hidden"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* User Header */}
                                            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                                                <div className="flex items-center space-x-3">
                                                    <div>
                                                        {renderUserAvatar(48, "text-lg font-bold")}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{getUserDisplayName()}</h3>
                                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                                        <p className="text-xs text-green-600 flex items-center">
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
                                                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <item.icon className="h-5 w-5 text-gray-400" />
                                                        <span>{item.name}</span>
                                                    </Link>
                                                ))}

                                                <hr className="my-2 border-gray-100" />

                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 w-full text-left"
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                                    <span>Đăng xuất</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        {showNavigation && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }}
                                className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                            >
                                {isMobileMenuOpen ? (
                                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6 text-gray-600" />
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {showNavigation && (
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl"
                            >
                                <div className="px-4 py-4 space-y-2">
                                    {/* Search on Mobile */}
                                    <div className="relative mb-4">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>

                                    {/* Navigation Links */}
                                    {defaultNavigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                                                item.bgColor,
                                                item.color
                                            )}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <div>
                                                <div>{item.name}</div>
                                                <div className="text-xs opacity-70">{item.description}</div>
                                            </div>
                                        </Link>
                                    ))}

                                    {/* User Section for Mobile */}
                                    {isAuthenticated && user && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                    {getUserDisplayName().charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{getUserDisplayName()}</p>
                                                    <p className="text-xs text-gray-500">@{user.username}</p>
                                                </div>
                                            </div>

                                            <div className="mt-2 space-y-1">
                                                {userMenuItems.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <item.icon className="h-4 w-4 text-gray-400" />
                                                        <span>{item.name}</span>
                                                    </Link>
                                                ))}

                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 w-full text-left"
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                                    <span>Đăng xuất</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </motion.nav>
    )
}

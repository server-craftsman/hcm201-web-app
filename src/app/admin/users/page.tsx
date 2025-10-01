'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { toast, Toaster } from 'react-hot-toast'
import { userApi } from '@/modules/debate/api/userApi'
import {
    UserGroupIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    UserIcon,
    ShieldCheckIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    GlobeAltIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    MapPinIcon,
    LinkIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface User {
    _id: string
    email: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
    role: string
    status: string
    isActive: boolean
    isVerified: boolean
    createdAt: string
    lastSeen: string
    phone?: number
    dateOfBirth?: string
    gender?: string
    bio?: string
    location?: string
    website?: string
}

const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRole, setSelectedRole] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const [limit] = useState(20)

    // Role change modal
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [newRole, setNewRole] = useState('')
    const [roleChangeReason, setRoleChangeReason] = useState('')

    // Load users
    const loadUsers = async () => {
        try {
            setLoading(true)
            setError(null)

            const params = {
                page: currentPage,
                limit,
                ...(searchTerm && { email: searchTerm }),
                ...(searchTerm && { username: searchTerm }),
                ...(selectedRole && { role: selectedRole }),
                ...(selectedStatus && { status: selectedStatus }),
                sortBy,
                sortOrder
            }

            const response = await userApi.getUsers(params)
            setUsers(response.data.items || [])
            setTotalPages(response.data.totalPages || 1)
            setTotalUsers(response.data.totalItems || 0)

            console.log('Users loaded:', response.data)
        } catch (error) {
            console.error('Failed to load users:', error)
            setError('Không thể tải danh sách người dùng')
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    // Change user role
    const handleChangeRole = async () => {
        if (!selectedUser || !newRole || !roleChangeReason) {
            toast.error('Vui lòng điền đầy đủ thông tin', {
                duration: 3000,
                style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                },
            })
            return
        }

        try {
            await userApi.changeUserRole({
                userId: selectedUser._id,
                newRole,
                reason: roleChangeReason
            })

            toast.success(`Đã thay đổi role của ${selectedUser.firstName} ${selectedUser.lastName} thành ${newRole}`, {
                duration: 4000,
                style: {
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                },
            })

            // Refresh users list
            loadUsers()
            setIsRoleModalOpen(false)
            setSelectedUser(null)
            setNewRole('')
            setRoleChangeReason('')
        } catch (error) {
            console.error('Failed to change user role:', error)
            toast.error('Có lỗi xảy ra khi thay đổi role', {
                duration: 4000,
                style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                },
            })
        }
    }

    // Open role change modal
    const openRoleChangeModal = (user: User) => {
        setSelectedUser(user)
        setNewRole(user.role)
        setIsRoleModalOpen(true)
        setRoleChangeReason('')
    }

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Vừa xong'
        if (diffInHours < 24) return `${diffInHours} giờ trước`
        return `${Math.floor(diffInHours / 24)} ngày trước`
    }

    // Get role style
    const getRoleStyle = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
            case 'MODERATOR':
                return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
            case 'USER':
                return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
            default:
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
        }
    }

    // Get status style
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ONLINE':
                return 'bg-green-100 text-green-800'
            case 'OFFLINE':
                return 'bg-gray-100 text-gray-800'
            case 'BUSY':
                return 'bg-red-100 text-red-800'
            case 'AWAY':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Load users on component mount and when filters change
    useEffect(() => {
        loadUsers()
    }, [currentPage, searchTerm, selectedRole, selectedStatus, sortBy, sortOrder])

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-8">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#ffffff',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }
                }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                👥 Quản lý người dùng
                            </h1>
                            <p className="text-gray-600">
                                Quản lý và theo dõi tất cả người dùng trong hệ thống
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={loadUsers}
                            disabled={loading}
                            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center space-x-2">
                                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                                <span>Làm mới</span>
                            </div>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Tổng người dùng</p>
                                <p className="text-3xl font-bold text-blue-700">{totalUsers}</p>
                            </div>
                            <UserGroupIcon className="h-8 w-8 text-blue-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Admin</p>
                                <p className="text-3xl font-bold text-red-700">
                                    {users.filter(user => user.role === 'ADMIN').length}
                                </p>
                            </div>
                            <UserIcon className="h-8 w-8 text-red-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Moderator</p>
                                <p className="text-3xl font-bold text-blue-700">
                                    {users.filter(user => user.role === 'MODERATOR').length}
                                </p>
                            </div>
                            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Online</p>
                                <p className="text-3xl font-bold text-green-700">
                                    {users.filter(user => user.status === 'ONLINE').length}
                                </p>
                            </div>
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                        </div>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FunnelIcon className="h-5 w-5 mr-2 text-gray-600" />
                            Bộ lọc và tìm kiếm
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm email, username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Tất cả role</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MODERATOR">Moderator</option>
                            <option value="USER">User</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="ONLINE">Online</option>
                            <option value="OFFLINE">Offline</option>
                            <option value="BUSY">Busy</option>
                            <option value="AWAY">Away</option>
                        </select>

                        {/* Sort By */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="createdAt">Ngày tạo</option>
                            <option value="lastSeen">Lần cuối online</option>
                            <option value="username">Username</option>
                            <option value="email">Email</option>
                        </select>

                        {/* Sort Order */}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="desc">Mới nhất</option>
                            <option value="asc">Cũ nhất</option>
                        </select>
                    </div>
                </motion.div>

                {/* Users List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                >
                    {loading ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Đang tải danh sách người dùng...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
                            </div>
                            <p className="text-red-600 text-lg">Có lỗi khi tải dữ liệu</p>
                            <p className="text-red-400 text-sm mt-1">Vui lòng thử lại sau</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={loadUsers}
                                className="mt-4 group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center space-x-2">
                                    <ArrowPathIcon className="h-5 w-5" />
                                    <span>Thử lại</span>
                                </div>
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </motion.button>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserGroupIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">Không tìm thấy người dùng nào</p>
                            <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc để tìm kiếm</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            {user.avatar && user.avatar.startsWith('http') ? (
                                                <Image
                                                    src={user.avatar}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    width={60}
                                                    height={60}
                                                    className="w-15 h-15 rounded-full object-cover border-4 border-white shadow-lg"
                                                />
                                            ) : (
                                                <div className="w-15 h-15 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg">
                                                    {user.firstName?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </h3>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleStyle(user.role)}`}>
                                                    {user.role === 'ADMIN' ? '👑 Admin' :
                                                        user.role === 'MODERATOR' ? '🛡️ Moderator' : '👤 User'}
                                                </span>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(user.status)}`}>
                                                    {user.status === 'ONLINE' ? '🟢 Online' :
                                                        user.status === 'OFFLINE' ? '⚫ Offline' :
                                                            user.status === 'BUSY' ? '🔴 Busy' : '🟡 Away'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <EnvelopeIcon className="h-4 w-4" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <UserIcon className="h-4 w-4" />
                                                        <span>@{user.username}</span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <PhoneIcon className="h-4 w-4" />
                                                            <span>{user.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <CalendarIcon className="h-4 w-4" />
                                                        <span>Tham gia: {formatTimeAgo(user.createdAt)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <ClockIcon className="h-4 w-4" />
                                                        <span>Online: {formatTimeAgo(user.lastSeen)}</span>
                                                    </div>
                                                    {user.location && (
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <MapPinIcon className="h-4 w-4" />
                                                            <span>{user.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {user.bio && (
                                                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                                    <p className="text-sm text-gray-700">{user.bio}</p>
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-4">
                                                {user.isVerified && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ✅ Đã xác thực
                                                    </span>
                                                )}
                                                {user.isActive && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        🟢 Hoạt động
                                                    </span>
                                                )}
                                                {user.website && (
                                                    <a
                                                        href={user.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                                                    >
                                                        <LinkIcon className="h-3 w-3 mr-1" />
                                                        Website
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => openRoleChangeModal(user)}
                                            className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-2">
                                                <PencilIcon className="h-4 w-4" />
                                                <span>Đổi role</span>
                                            </div>
                                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </motion.button>

                                        {/* <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => window.open(`/profile/${user._id}`, '_blank')}
                                            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-2">
                                                <EyeIcon className="h-4 w-4" />
                                                <span>Xem profile</span>
                                            </div>
                                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </motion.button> */}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex justify-center mt-8"
                    >
                        <div className="flex items-center space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Trước
                            </motion.button>

                            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium">
                                {currentPage} / {totalPages}
                            </span>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sau
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Role Change Modal */}
                <AnimatePresence>
                    {isRoleModalOpen && selectedUser && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
                            onClick={() => setIsRoleModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full shadow-2xl border border-white/30"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 p-8 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                                <ShieldCheckIcon className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">Thay đổi vai trò</h2>
                                                <p className="text-orange-100 text-sm mt-1">
                                                    Thay đổi vai trò của {selectedUser.firstName} {selectedUser.lastName}
                                                </p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsRoleModalOpen(false)}
                                            className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                                        >
                                            <XCircleIcon className="h-6 w-6" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="space-y-6">
                                        {/* Current User Info */}
                                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    {selectedUser.avatar && selectedUser.avatar.startsWith('http') ? (
                                                        <Image
                                                            src={selectedUser.avatar}
                                                            alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                                            width={60}
                                                            height={60}
                                                            className="w-15 h-15 rounded-full object-cover border-4 border-white shadow-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-15 h-15 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg">
                                                            {selectedUser.firstName?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {selectedUser.firstName} {selectedUser.lastName}
                                                    </h3>
                                                    <p className="text-gray-600">@{selectedUser.username}</p>
                                                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Role Selection */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Vai trò mới
                                            </label>
                                            <select
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            >
                                                <option value="USER">👤 User - Người dùng thông thường</option>
                                                <option value="MODERATOR">🛡️ Moderator - Kiểm duyệt viên</option>
                                                <option value="ADMIN">👑 Admin - Quản trị viên</option>
                                            </select>
                                        </div>

                                        {/* Reason */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Lý do thay đổi
                                            </label>
                                            <textarea
                                                value={roleChangeReason}
                                                onChange={(e) => setRoleChangeReason(e.target.value)}
                                                placeholder="Nhập lý do thay đổi vai trò..."
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50/80 to-gray-100/80">
                                    <div className="flex justify-end space-x-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsRoleModalOpen(false)}
                                            className="group relative overflow-hidden bg-white text-gray-700 border-2 border-gray-300 px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-2">
                                                <span>Hủy</span>
                                            </div>
                                            <div className="absolute inset-0 bg-gray-200/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleChangeRole}
                                            className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-2">
                                                <ShieldCheckIcon className="h-5 w-5" />
                                                <span>Thay đổi vai trò</span>
                                            </div>
                                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default AdminUsersPage

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { toast, Toaster } from 'react-hot-toast'
import { userApi } from '@/modules/debate/api/userApi'
import { uploadAvatar } from '@/shared/utils/cloudinary'
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    MapPinIcon,
    LinkIcon,
    PencilIcon,
    KeyIcon,
    CameraIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    EyeSlashIcon,
    GlobeAltIcon,
    HeartIcon,
    StarIcon,
    ClockIcon
} from '@heroicons/react/24/outline'

interface UserProfile {
    id: string
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

const ProfilePage = () => {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Profile edit form
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        phone: 0,
        dateOfBirth: '',
        gender: '',
        bio: '',
        location: '',
        avatar: ''
    })

    // Password change form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    // Load user profile from localStorage
    const loadUserProfile = () => {
        try {
            const currentUserStr = localStorage.getItem('currentUser')
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr)
                setUser(currentUser)
                setEditForm({
                    firstName: currentUser.firstName || '',
                    lastName: currentUser.lastName || '',
                    email: currentUser.email || '',
                    username: currentUser.username || '',
                    phone: currentUser.phone || '',
                    dateOfBirth: currentUser.dateOfBirth || '',
                    gender: currentUser.gender || '',
                    bio: currentUser.bio || '',
                    location: currentUser.location || '',
                    avatar: currentUser.avatar || ''
                })
            } else {
                toast.error('Không tìm thấy thông tin người dùng', {
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
                    icon: '❌'
                })
            }
        } catch (error) {
            console.error('Failed to load user profile:', error)
            toast.error('Có lỗi khi tải thông tin người dùng', {
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
                icon: '❌'
            })
        } finally {
            setLoading(false)
        }
    }

    // Update profile
    const handleUpdateProfile = async () => {
        if (!user) return

        try {
            // Filter out empty string values and zero phone numbers
            const filteredForm = Object.entries(editForm).reduce((acc, [key, value]) => {
                // Skip empty strings and zero phone numbers
                if (value !== '' && value !== 0 && value !== null && value !== undefined) {
                    acc[key] = value
                }
                return acc
            }, {} as any)

            const response = await userApi.updateUserProfile(user.id, filteredForm)

            // Update localStorage with all form data (including empty values for display)
            const updatedUser = { ...user, ...editForm }
            localStorage.setItem('currentUser', JSON.stringify(updatedUser))
            setUser(updatedUser)

            toast.success('Cập nhật thông tin thành công!', {
                duration: 3000,
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

            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error('Có lỗi xảy ra khi cập nhật thông tin', {
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
        }
    }

    // Handle avatar upload
    const handleAvatarUpload = async (file: File) => {
        if (!user) return

        try {
            setIsUploadingAvatar(true)

            // Upload to Cloudinary
            const newAvatarUrl = await uploadAvatar(file, user.id)

            // Update avatar in editForm
            setEditForm({ ...editForm, avatar: newAvatarUrl })

            // Update user state
            const updatedUser = { ...user, avatar: newAvatarUrl }
            setUser(updatedUser)

            // Update localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser))

            // If not in editing mode, also update via API
            if (!isEditing) {
                await userApi.updateUserProfile(user.id, { avatar: newAvatarUrl })
            }

            toast.success('Cập nhật avatar thành công!', {
                duration: 3000,
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

        } catch (error) {
            console.error('Failed to update avatar:', error)
            toast.error('Có lỗi xảy ra khi cập nhật avatar', {
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
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]

            // Validate file
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file hình ảnh', {
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

            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước file không được vượt quá 5MB', {
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

            handleAvatarUpload(file)
        }
    }

    // Handle camera icon click
    const handleCameraClick = () => {
        if (!isUploadingAvatar) {
            fileInputRef.current?.click()
        }
    }

    // Change password
    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp', {
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
                icon: '❌'
            })
            return
        }

        try {
            await userApi.changePassword(passwordForm)

            toast.success('Đổi mật khẩu thành công!', {
                duration: 3000,
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

            setIsPasswordModalOpen(false)
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (error) {
            console.error('Failed to change password:', error)
            toast.error('Có lỗi xảy ra khi đổi mật khẩu', {
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
        }
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

    // Load profile on component mount
    useEffect(() => {
        loadUserProfile()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải thông tin cá nhân...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
                    </div>
                    <p className="text-red-600 text-lg">Không tìm thấy thông tin người dùng</p>
                    <p className="text-red-400 text-sm mt-1">Vui lòng đăng nhập lại</p>
                </div>
            </div>
        )
    }

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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                👤 Hồ sơ cá nhân
                            </h1>
                            <p className="text-gray-600">
                                Quản lý thông tin cá nhân và cài đặt tài khoản
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center space-x-2">
                                    <KeyIcon className="h-5 w-5" />
                                    <span>Đổi mật khẩu</span>
                                </div>
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(!isEditing)}
                                className={`group relative overflow-hidden px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${isEditing
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                    }`}
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isEditing
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-700'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-700'
                                    }`}></div>
                                <div className="relative flex items-center space-x-2">
                                    <PencilIcon className="h-5 w-5" />
                                    <span>{isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}</span>
                                </div>
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
                >
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 p-8 text-white">
                        <div className="flex items-center space-x-6">
                            {/* Avatar */}
                            <div className="relative">
                                {user.avatar && user.avatar.startsWith('http') ? (
                                    <Image
                                        src={user.avatar}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        width={120}
                                        height={120}
                                        className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-2xl"
                                    />
                                ) : (
                                    <div className="w-30 h-30 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-2xl">
                                        {user.firstName?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleCameraClick}
                                    disabled={isUploadingAvatar}
                                    className="absolute -bottom-2 -right-2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploadingAvatar ? (
                                        <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <CameraIcon className="h-5 w-5 text-gray-600" />
                                    )}
                                </motion.button>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-3">
                                    <h2 className="text-3xl font-bold">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getRoleStyle(user.role)}`}>
                                        {user.role === 'ADMIN' ? '👑 Admin' :
                                            user.role === 'MODERATOR' ? '🛡️ Moderator' : '👤 User'}
                                    </span>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(user.status)}`}>
                                        {user.status === 'ONLINE' ? '🟢 Online' :
                                            user.status === 'OFFLINE' ? '⚫ Offline' :
                                                user.status === 'BUSY' ? '🔴 Busy' : '🟡 Away'}
                                    </span>
                                </div>
                                <p className="text-blue-100 text-lg mb-2">@{user.username}</p>
                                <p className="text-blue-100 text-sm mb-4">{user.email}</p>

                                <div className="flex items-center space-x-6 text-sm text-blue-100">
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>Tham gia: {formatTimeAgo(user.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ClockIcon className="h-4 w-4" />
                                        <span>Online: {formatTimeAgo(user.lastSeen)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <UserIcon className="h-6 w-6 mr-2 text-blue-600" />
                                    Thông tin cá nhân
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Họ
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.firstName}
                                                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                />
                                            ) : (
                                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                                    {user.firstName || 'Chưa cập nhật'}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tên
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.lastName}
                                                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                />
                                            ) : (
                                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                                    {user.lastName || 'Chưa cập nhật'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center">
                                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {user.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Username
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.username}
                                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center">
                                                <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                @{user.username}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center">
                                                <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {user.phone || 'Chưa cập nhật'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <GlobeAltIcon className="h-6 w-6 mr-2 text-purple-600" />
                                    Thông tin bổ sung
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày sinh
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editForm.dateOfBirth}
                                                onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {user.dateOfBirth || 'Chưa cập nhật'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giới tính
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editForm.gender}
                                                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="MALE">Nam</option>
                                                <option value="FEMALE">Nữ</option>
                                                <option value="OTHER">Khác</option>
                                            </select>
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                                {user.gender === 'MALE' ? 'Nam' :
                                                    user.gender === 'FEMALE' ? 'Nữ' :
                                                        user.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Địa chỉ
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.location}
                                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center">
                                                <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {user.location || 'Chưa cập nhật'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giới thiệu bản thân
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                value={editForm.bio}
                                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                                                placeholder="Viết một chút về bản thân..."
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[100px]">
                                                {user.bio || 'Chưa có giới thiệu về bản thân'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-end space-x-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setIsEditing(false)
                                            setEditForm({
                                                firstName: user.firstName || '',
                                                lastName: user.lastName || '',
                                                email: user.email || '',
                                                username: user.username || '',
                                                phone: user.phone || 0,
                                                dateOfBirth: user.dateOfBirth || '',
                                                gender: user.gender || '',
                                                bio: user.bio || '',
                                                location: user.location || '',
                                                avatar: user.avatar || ''
                                            })
                                        }}
                                        className="group relative overflow-hidden bg-white text-gray-700 border-2 border-gray-300 px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-2">
                                            <XCircleIcon className="h-5 w-5" />
                                            <span>Hủy</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gray-200/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleUpdateProfile}
                                        className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-2">
                                            <CheckCircleIcon className="h-5 w-5" />
                                            <span>Lưu thay đổi</span>
                                        </div>
                                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Password Change Modal */}
                <AnimatePresence>
                    {isPasswordModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
                            onClick={() => setIsPasswordModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full shadow-2xl border border-white/30"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 p-8 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                                <KeyIcon className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">Đổi mật khẩu</h2>
                                                <p className="text-purple-100 text-sm mt-1">
                                                    Thay đổi mật khẩu để bảo mật tài khoản
                                                </p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsPasswordModalOpen(false)}
                                            className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                                        >
                                            <XCircleIcon className="h-6 w-6" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="space-y-6">
                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Mật khẩu hiện tại
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.current ? 'text' : 'password'}
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    placeholder="Nhập mật khẩu hiện tại"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.current ? (
                                                        <EyeSlashIcon className="h-5 w-5" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.new ? 'text' : 'password'}
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    placeholder="Nhập mật khẩu mới"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.new ? (
                                                        <EyeSlashIcon className="h-5 w-5" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.confirm ? 'text' : 'password'}
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    placeholder="Nhập lại mật khẩu mới"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.confirm ? (
                                                        <EyeSlashIcon className="h-5 w-5" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50/80 to-gray-100/80">
                                    <div className="flex justify-end space-x-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsPasswordModalOpen(false)}
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
                                            onClick={handleChangePassword}
                                            className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-2">
                                                <KeyIcon className="h-5 w-5" />
                                                <span>Đổi mật khẩu</span>
                                            </div>
                                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                />
            </div>
        </div>
    )
}

export default ProfilePage

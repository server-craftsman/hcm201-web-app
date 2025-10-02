'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    ChartBarIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    ArrowPathIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    FireIcon,
    HeartIcon,
    ChatBubbleLeftIcon,
    EyeSlashIcon,
    UsersIcon,
    GlobeAltIcon,
    BoltIcon,
    StarIcon
} from '@heroicons/react/24/outline'

import { threadApi } from '@/modules/debate/api/threadApi'
import { debateApi } from '@/modules/debate/api/debateApi'
import { useModerationQueue } from '@/modules/debate/hooks/useDebateApi'
import Link from 'next/link'

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<string>('')

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            const response = await debateApi.getAdminDashboard()
            setDashboardData(response.data)
            setLastUpdated(response.data.lastUpdated)
            console.log('📊 Dashboard data loaded:', response.data)
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDashboardData()
    }, [])


    const formatTimeAgo = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return 'Vừa xong'
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'vote_cast': return <HeartIcon className="h-4 w-4 text-red-500" />
            case 'thread_created': return <ChatBubbleLeftIcon className="h-4 w-4 text-blue-500" />
            case 'argument_created': return <BoltIcon className="h-4 w-4 text-yellow-500" />
            default: return <StarIcon className="h-4 w-4 text-gray-500" />
        }
    }

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'vote_cast': return 'bg-red-50 border-red-200'
            case 'thread_created': return 'bg-blue-50 border-blue-200'
            case 'argument_created': return 'bg-yellow-50 border-yellow-200'
            default: return 'bg-gray-50 border-gray-200'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Đang tải dữ liệu dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">Không thể tải dữ liệu dashboard</p>
                    </div>
                </div>
            </div>
        )
    }

    const { threadStats, argumentStats, userStats, systemStats, recentActivity } = dashboardData

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                🎛️ Bảng điều khiển Admin
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Quản lý hệ thống tranh luận Tư tưởng Hồ Chí Minh
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Cập nhật lần cuối: {formatTimeAgo(lastUpdated)}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={loadDashboardData}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <ArrowPathIcon className="h-5 w-5 mr-2" />
                            Làm mới
                        </motion.button>
                    </div>
                </motion.div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Thread Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                                <ChatBubbleLeftIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-gray-900">{threadStats.total}</p>
                                <p className="text-sm text-gray-600">Tổng chủ đề</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Chờ duyệt</span>
                                <span className="font-semibold text-yellow-600">{threadStats.pending}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Đang hoạt động</span>
                                <span className="font-semibold text-green-600">{threadStats.active}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Đã đóng</span>
                                <span className="font-semibold text-red-600">{threadStats.closed}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Argument Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
                                <BoltIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-gray-900">{argumentStats.total}</p>
                                <p className="text-sm text-gray-600">Tổng luận điểm</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Chờ duyệt</span>
                                <span className="font-semibold text-yellow-600">{argumentStats.pending}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Đã duyệt</span>
                                <span className="font-semibold text-green-600">{argumentStats.approved}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Bị từ chối</span>
                                <span className="font-semibold text-red-600">{argumentStats.rejected}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* User Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                                <UsersIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-gray-900">{userStats.total}</p>
                                <p className="text-sm text-gray-600">Tổng người dùng</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Trực tuyến</span>
                                <span className="font-semibold text-green-600">{userStats.online}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Ngoại tuyến</span>
                                <span className="font-semibold text-gray-600">{userStats.offline}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Hoạt động 24h</span>
                                <span className="font-semibold text-blue-600">{userStats.activeUsersLast24Hours}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* System Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                                <HeartIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-gray-900">{systemStats.totalVotes}</p>
                                <p className="text-sm text-gray-600">Tổng bình chọn</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Ủng hộ</span>
                                <span className="font-semibold text-green-600">{systemStats.supportVotes}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Phản đối</span>
                                <span className="font-semibold text-red-600">{systemStats.opposeVotes}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Lượt xem</span>
                                <span className="font-semibold text-blue-600">{systemStats.totalViews}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <FireIcon className="h-6 w-6 mr-3 text-orange-500" />
                            Hoạt động gần đây
                        </h3>
                        <p className="text-gray-600 mt-1">Theo dõi các hoạt động mới nhất trong hệ thống</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentActivity && recentActivity.length > 0 ? (
                                recentActivity.slice(0, 8).map((activity: any, index: number) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className={`flex items-center p-4 rounded-xl border ${getActivityColor(activity.type)} hover:shadow-md transition-all duration-200`}
                                    >
                                        <div className="flex-shrink-0 mr-4">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-900 truncate">
                                                    {activity.title}
                                                </h4>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {formatTimeAgo(activity.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Bởi <span className="font-medium text-gray-800">@{activity.user}</span>
                                            </p>
                                            {activity.status && (
                                                <div className="mt-2">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'SUPPORT' ? 'bg-green-100 text-green-800' :
                                                        activity.status === 'OPPOSE' ? 'bg-red-100 text-red-800' :
                                                            activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                activity.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                                    activity.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                                                                        activity.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                                                                            activity.status === 'DRAFT' ? 'bg-orange-100 text-orange-800' :
                                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {activity.status === 'SUPPORT' ? 'Ủng hộ' :
                                                            activity.status === 'OPPOSE' ? 'Phản đối' :
                                                                activity.status === 'PENDING' ? 'Chờ duyệt' :
                                                                    activity.status === 'APPROVED' ? 'Đã duyệt' :
                                                                        activity.status === 'ACTIVE' ? 'Đang hoạt động' :
                                                                            activity.status === 'CLOSED' ? 'Đã đóng' :
                                                                                activity.status === 'DRAFT' ? 'Bản nháp' :
                                                                                    activity.status}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ClockIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-lg">Chưa có hoạt động nào</p>
                                    <p className="text-gray-400 text-sm mt-1">Các hoạt động sẽ hiển thị ở đây</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-green-50 to-blue-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <BoltIcon className="h-6 w-6 mr-3 text-yellow-500" />
                            Hành động nhanh
                        </h3>
                        <p className="text-gray-600 mt-1">Truy cập nhanh các chức năng quản lý</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                                    <ShieldCheckIcon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="font-semibold text-red-700 mb-1">Duyệt chủ đề</h4>
                                <p className="text-xs text-red-600 text-center">Quản lý và duyệt các chủ đề tranh luận</p>
                            </motion.button>

                            <Link href="/admin/users">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                                        <UserGroupIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-blue-700 mb-1">Quản lý user</h4>
                                    <p className="text-xs text-blue-600 text-center">Quản lý người dùng và phân quyền</p>
                                </motion.button>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                                    <ChartBarIcon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="font-semibold text-green-700 mb-1">Xem thống kê</h4>
                                <p className="text-xs text-green-600 text-center">Phân tích và báo cáo chi tiết</p>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                                    <EyeIcon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="font-semibold text-purple-700 mb-1">Giám sát</h4>
                                <p className="text-xs text-purple-600 text-center">Theo dõi và giám sát hệ thống</p>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default AdminDashboard

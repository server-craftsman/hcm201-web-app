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
    EyeIcon
} from '@heroicons/react/24/outline'

import { threadApi } from '@/modules/debate/api/threadApi'
import { debateApi } from '@/modules/debate/api/debateApi'
import { useModerationQueue } from '@/modules/debate/hooks/useDebateApi'

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalThreads: 0,
        pendingApproval: 0,
        activeThreads: 0,
        totalUsers: 0,
        totalModerators: 0,
        totalArguments: 0,
        pendingArguments: 0,
        rejectedArguments: 0,
        avgModerationTime: 45,
        todayVotes: 0
    })

    const { items, meta } = useModerationQueue({ status: 'pending', page: 1, limit: 10 })

    useEffect(() => {
        const load = async () => {
            try {
                const pendingReq = await threadApi.getThreadRequests(1, 1, 'PENDING')
                const activeRes = await debateApi.getDebateThreads({ status: 'ACTIVE', page: 1, limit: 1, search: '', sort: 'createdAt:-1' })
                const allRes = await debateApi.getDebateThreads({ page: 1, limit: 1, search: '', sort: 'createdAt:-1' })

                setStats((prev) => ({
                    ...prev,
                    pendingApproval: pendingReq.data.totalItems,
                    activeThreads: activeRes.data.totalItems,
                    totalThreads: allRes.data.totalItems,
                    pendingArguments: items.length
                }))
            } catch (e) {
                console.warn('Failed to load admin stats', e)
            }
        }
        load()
    }, [items.length])

    const recentThreadRequests = [
        {
            id: 1,
            title: "Tư tưởng Hồ Chí Minh trong giáo dục hiện đại",
            author: "Nguyễn Văn A",
            createdAt: "2 giờ trước",
            status: "PENDING"
        },
        {
            id: 2,
            title: "Giá trị văn hóa dân tộc trong tư tưởng Hồ Chí Minh",
            author: "Trần Thị B",
            createdAt: "4 giờ trước",
            status: "PENDING"
        },
        {
            id: 3,
            title: "Đạo đức cách mạng theo quan điểm Hồ Chí Minh",
            author: "Lê Văn C",
            createdAt: "1 ngày trước",
            status: "APPROVED"
        }
    ]

    const moderatorPerformance = [
        {
            id: 1,
            name: "Trần Kiểm Duyệt",
            avatar: "TK",
            moderatedToday: 12,
            avgTime: 35,
            approvalRate: 85
        },
        {
            id: 2,
            name: "Lê Giám Sát",
            avatar: "LG",
            moderatedToday: 8,
            avgTime: 52,
            approvalRate: 78
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🎛️ Bảng điều khiển Admin
                    </h1>
                    <p className="text-gray-600">
                        Quản lý hệ thống tranh luận Tư tưởng Hồ Chí Minh
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chủ đề chờ duyệt</p>
                                <p className="text-3xl font-bold text-red-600">{stats.pendingApproval}</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-full">
                                <ClockIcon className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Cần xử lý ngay</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chủ đề đang hoạt động</p>
                                <p className="text-3xl font-bold text-green-600">{stats.activeThreads}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Tổng {stats.totalThreads} chủ đề</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <UserGroupIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">{stats.totalModerators} kiểm duyệt viên</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Luận điểm chờ duyệt</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.pendingArguments}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Tổng {stats.totalArguments} luận điểm</span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Yêu cầu chủ đề gần đây */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Yêu cầu chủ đề gần đây
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentThreadRequests.map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                {request.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Bởi {request.author} • {request.createdAt}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            {request.status === 'PENDING' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Chờ duyệt
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Đã duyệt
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Xem tất cả yêu cầu
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hiệu suất kiểm duyệt */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <ChartBarIcon className="h-5 w-5 mr-2 text-green-600" />
                                Hiệu suất kiểm duyệt
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {moderatorPerformance.map((mod) => (
                                    <div key={mod.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                                            {mod.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{mod.name}</h4>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                <span>✅ {mod.moderatedToday} hôm nay</span>
                                                <span>⏱️ {mod.avgTime}p</span>
                                                <span>📊 {mod.approvalRate}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-blue-800 font-medium">Thời gian kiểm duyệt trung bình:</span>
                                    <span className="text-blue-600 font-bold">{stats.avgModerationTime} phút</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <ShieldCheckIcon className="h-5 w-5 mr-2" />
                            Duyệt chủ đề
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <UserGroupIcon className="h-5 w-5 mr-2" />
                            Quản lý user
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <ChartBarIcon className="h-5 w-5 mr-2" />
                            Xem thống kê
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                            <EyeIcon className="h-5 w-5 mr-2" />
                            Giám sát
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default AdminDashboard

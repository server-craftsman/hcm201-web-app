'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useModerationQueue } from '@/modules/debate/hooks'
import {
    ClipboardDocumentListIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    FlagIcon,
    EyeIcon,
    StarIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const ModerationDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('PENDING')

    // Use API hook for real moderation queue data
    const {
        items: queueItems,
        loading: queueLoading,
        error: queueError,
        meta: queueMeta,
        refetch: refetchQueue
    } = useModerationQueue({
        status: selectedTab === 'pending' ? 'PENDING' : '',
        page: 1,
        limit: 10
    })

    // Use API stats if available, fallback to mock data
    const stats = {
        pendingArguments: queueItems.filter(item => item.status === 'PENDING').length || 12,
        approvedToday: 8, // This would need a separate API call for daily stats
        rejectedToday: 3,
        flaggedArguments: queueItems.filter(item => item.status === 'PENDING' && item.content.includes('flag')).length || 2,
        avgProcessingTime: 35, // phút
        myApprovalRate: 85,
        totalProcessed: 156
    }

    const pendingArguments = [
        {
            id: 1,
            title: "Thực học gắn với hành",
            content: "Đề cao giá trị đạo đức và năng lực thực tiễn trong giáo dục...",
            author: "Nguyễn Văn A",
            threadTitle: "Tư tưởng Hồ Chí Minh trong giáo dục",
            argumentType: "SUPPORT",
            createdAt: "10 phút trước",
            wordCount: 245
        },
        {
            id: 2,
            title: "Văn hóa dân tộc",
            content: "Giá trị văn hóa truyền thống cần được bảo tồn và phát triển...",
            author: "Trần Thị B",
            threadTitle: "Giá trị văn hóa dân tộc",
            argumentType: "NEUTRAL",
            createdAt: "25 phút trước",
            wordCount: 198
        },
        {
            id: 3,
            title: "Đạo đức cách mạng",
            content: "Tinh thần hy sinh vì tổ quốc là nền tảng của đạo đức cách mạng...",
            author: "Lê Văn C",
            threadTitle: "Đạo đức cách mạng Hồ Chí Minh",
            argumentType: "OPPOSE",
            createdAt: "1 giờ trước",
            wordCount: 312
        }
    ]

    const recentActions = [
        {
            id: 1,
            action: "APPROVE",
            argumentTitle: "Tư tưởng giáo dục toàn diện",
            author: "Phạm Văn D",
            timestamp: "5 phút trước",
            notes: "Phù hợp với chủ đề, có dẫn chứng"
        },
        {
            id: 2,
            action: "REJECT",
            argumentTitle: "Quan điểm cá nhân",
            author: "Hoàng Thị E",
            timestamp: "15 phút trước",
            notes: "Thiếu căn cứ lý luận"
        },
        {
            id: 3,
            action: "FLAG",
            argumentTitle: "Góc nhìn khác biệt",
            author: "Vũ Văn F",
            timestamp: "30 phút trước",
            notes: "Cần xem xét thêm"
        }
    ]

    const getArgumentTypeStyle = (type: string) => {
        switch (type) {
            case 'SUPPORT':
                return 'bg-green-100 text-green-800'
            case 'OPPOSE':
                return 'bg-red-100 text-red-800'
            case 'NEUTRAL':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getActionStyle = (action: string) => {
        switch (action) {
            case 'APPROVE':
                return 'bg-green-100 text-green-800'
            case 'REJECT':
                return 'bg-red-100 text-red-800'
            case 'FLAG':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const handleModerationAction = (argumentId: number, action: string) => {
        // Sẽ implement API call ở đây
        console.log(`${action} argument ${argumentId}`)
    }

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
                        🛡️ Dashboard Kiểm duyệt
                    </h1>
                    <p className="text-gray-600">
                        Kiểm duyệt luận điểm và duy trì chất lượng thảo luận
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
                                <p className="text-sm font-medium text-gray-600">Chờ kiểm duyệt</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.pendingArguments}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <ClockIcon className="h-6 w-6 text-orange-600" />
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
                                <p className="text-sm font-medium text-gray-600">Đã duyệt hôm nay</p>
                                <p className="text-3xl font-bold text-green-600">{stats.approvedToday}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">{stats.rejectedToday} bị từ chối</span>
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
                                <p className="text-sm font-medium text-gray-600">Tỷ lệ duyệt</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.myApprovalRate}%</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <StarIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Hiệu suất tốt</span>
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
                                <p className="text-sm font-medium text-gray-600">Thời gian xử lý</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.avgProcessingTime}p</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <ClockIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Trung bình</span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Hàng chờ kiểm duyệt */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-orange-600" />
                                    Hàng chờ kiểm duyệt
                                </h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setSelectedTab('pending')}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTab === 'pending'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Chờ duyệt ({stats.pendingArguments})
                                    </button>
                                    <button
                                        onClick={() => setSelectedTab('flagged')}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTab === 'flagged'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Đã flag ({stats.flaggedArguments})
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {queueLoading && (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-6">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {queueError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <p className="text-red-800 font-medium">Lỗi tải dữ liệu:</p>
                                    <p className="text-red-600">{queueError}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Use API data if available, fallback to mock data */}
                                {(queueItems.length > 0 ? queueItems.map(item => ({
                                    id: parseInt(item.id),
                                    title: `Luận điểm từ thread ${item.threadId}`,
                                    content: item.content,
                                    author: `User ${item.authorId}`,
                                    threadTitle: `Thread ${item.threadId}`,
                                    argumentType: item.argumentType.toUpperCase(),
                                    createdAt: new Date(item.createdAt).toLocaleString('vi-VN'),
                                    wordCount: item.content.length
                                })) : pendingArguments).map((argument) => (
                                    <div key={argument.id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h4 className="font-semibold text-gray-900">{argument.title}</h4>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getArgumentTypeStyle(argument.argumentType)}`}>
                                                        {argument.argumentType === 'SUPPORT' ? 'Ủng hộ' :
                                                            argument.argumentType === 'OPPOSE' ? 'Phản đối' : 'Trung lập'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Chủ đề: {argument.threadTitle}
                                                </p>
                                                <p className="text-gray-700 mb-3 line-clamp-3">
                                                    {argument.content}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>👤 {argument.author}</span>
                                                    <span>⏰ {argument.createdAt}</span>
                                                    <span>📝 {argument.wordCount} từ</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleModerationAction(argument.id, 'APPROVE')}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                Duyệt
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleModerationAction(argument.id, 'REJECT')}
                                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <XCircleIcon className="h-4 w-4 mr-1" />
                                                Từ chối
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleModerationAction(argument.id, 'FLAG')}
                                                className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                            >
                                                <FlagIcon className="h-4 w-4 mr-1" />
                                                Flag
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                <EyeIcon className="h-4 w-4 mr-1" />
                                                Xem chi tiết
                                            </motion.button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Hoạt động gần đây */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Hoạt động gần đây
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentActions.map((action) => (
                                    <div key={action.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionStyle(action.action)}`}>
                                            {action.action === 'APPROVE' ? 'Duyệt' :
                                                action.action === 'REJECT' ? 'Từ chối' : 'Flag'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm">
                                                {action.argumentTitle}
                                            </p>
                                            <p className="text-xs text-gray-600 mb-1">
                                                Bởi {action.author}
                                            </p>
                                            <p className="text-xs text-gray-500 italic">
                                                "{action.notes}"
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {action.timestamp}
                                            </p>
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
                                    Xem nhật ký đầy đủ
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ModerationDashboard

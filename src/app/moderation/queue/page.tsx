'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useModerationQueue } from '@/modules/debate/hooks'
import {
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    XCircleIcon,
    FlagIcon,
    EyeIcon,
    FunnelIcon,
    ClockIcon,
    UserIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    StarIcon
} from '@heroicons/react/24/outline'

const ModerationQueuePage = () => {
    const [selectedFilter, setSelectedFilter] = useState('all')
    const [selectedArgument, setSelectedArgument] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [moderationNote, setModerationNote] = useState('')

    // Use API hook for real moderation queue data
    const {
        items: apiQueueItems,
        loading: apiLoading,
        error: apiError,
        meta: apiMeta,
        refetch: refetchQueue
    } = useModerationQueue({
        status: selectedFilter === 'pending' ? 'pending' : selectedFilter === 'flagged' ? 'flagged' : '',
        page: 1,
        limit: 20
    })

    // Use API stats if available, fallback to mock data
    const queueStats = {
        total: apiMeta.total || 25,
        pending: apiQueueItems.filter(item => item.status === 'pending').length || 18,
        flagged: apiQueueItems.filter(item => item.status === 'rejected').length || 4,
        myAssigned: apiMeta.total || 12,
        avgWaitTime: 45 // phút
    }

    const argumentsData = [
        {
            id: 1,
            title: "Giáo dục toàn diện trong tư tưởng Hồ Chí Minh",
            content: "Tư tưởng Hồ Chí Minh về giáo dục không chỉ dừng lại ở việc truyền đạt kiến thức mà còn chú trọng việc rèn luyện nhân cách, đạo đức và phát triển toàn diện con người. Điều này thể hiện qua quan điểm 'học đi đôi với hành', 'lý luận gắn liền với thực tiễn'. Trong bối cảnh giáo dục hiện đại, những tư tưởng này vẫn có giá trị định hướng quan trọng...",
            author: {
                name: "Nguyễn Văn An",
                avatar: "NV",
                role: "USER",
                reputation: 85
            },
            thread: {
                id: 1,
                title: "Tư tưởng Hồ Chí Minh trong giáo dục hiện đại",
                category: "Giáo dục"
            },
            argumentType: "SUPPORT",
            status: "PENDING",
            priority: "MEDIUM",
            createdAt: "2024-01-15T10:30:00",
            waitTime: 45, // phút
            wordCount: 342,
            sources: ["Hồ Chí Minh toàn tập", "Nghiên cứu giáo dục Việt Nam"],
            assignedTo: "current_moderator",
            flags: [],
            relatedArguments: 3
        },
        {
            id: 2,
            title: "Vai trò văn hóa dân tộc trong thời đại mới",
            content: "Văn hóa dân tộc không chỉ là di sản quá khứ mà còn là nguồn lực tinh thần trong xây dựng đất nước. Tuy nhiên, trong bối cảnh toàn cầu hóa, cần có những điều chỉnh phù hợp để văn hóa truyền thống không trở thành rào cản cho sự phát triển...",
            author: {
                name: "Trần Thị Bích",
                avatar: "TB",
                role: "USER",
                reputation: 72
            },
            thread: {
                id: 2,
                title: "Giá trị văn hóa dân tộc trong tư tưởng Hồ Chí Minh",
                category: "Văn hóa"
            },
            argumentType: "NEUTRAL",
            status: "PENDING",
            priority: "HIGH",
            createdAt: "2024-01-15T09:15:00",
            waitTime: 120, // phút
            wordCount: 234,
            sources: ["Về văn hóa Việt Nam", "Di sản văn hóa dân tộc"],
            assignedTo: "current_moderator",
            flags: ["Cần xem xét thêm"],
            relatedArguments: 5
        },
        {
            id: 3,
            title: "Đạo đức cách mạng trong xã hội hiện đại",
            content: "Đạo đức cách mạng theo tư tưởng Hồ Chí Minh cần được hiểu và áp dụng phù hợp với điều kiện xã hội hiện đại. Không thể áp dụng máy móc những chuẩn mực đạo đức thời chiến tranh vào thời bình...",
            author: {
                name: "Lê Minh Đức",
                avatar: "LD",
                role: "USER",
                reputation: 91
            },
            thread: {
                id: 3,
                title: "Đạo đức cách mạng theo tư tưởng Hồ Chí Minh",
                category: "Đạo đức"
            },
            argumentType: "OPPOSE",
            status: "FLAGGED",
            priority: "HIGH",
            createdAt: "2024-01-15T08:45:00",
            waitTime: 180, // phút
            wordCount: 189,
            sources: [],
            assignedTo: "current_moderator",
            flags: ["Quan điểm gây tranh cãi", "Cần admin xem xét"],
            relatedArguments: 2
        }
    ]

    // Convert API data to UI format
    const convertedApiItems = apiQueueItems.map(item => ({
        id: parseInt(item.id),
        title: `Luận điểm từ thread ${item.threadId}`,
        content: item.content,
        author: {
            name: `User ${item.authorId}`,
            avatar: "U",
            role: "USER",
            reputation: 85
        },
        thread: {
            id: parseInt(item.threadId),
            title: `Thread ${item.threadId}`,
            category: "API Data"
        },
        argumentType: item.argumentType.toUpperCase(),
        status: item.status.toUpperCase(),
        priority: "MEDIUM",
        createdAt: item.createdAt,
        waitTime: Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 60000),
        wordCount: item.content.length,
        sources: [],
        assignedTo: "current_moderator",
        flags: [],
        relatedArguments: 1
    }))

    // Use API data if available, fallback to mock data
    const allArgumentsData = apiQueueItems.length > 0 ? convertedApiItems : argumentsData

    const filteredArgumentsData = allArgumentsData.filter(arg => {
        switch (selectedFilter) {
            case 'pending':
                return arg.status === 'PENDING'
            case 'flagged':
                return arg.status === 'FLAGGED'
            case 'high-priority':
                return arg.priority === 'HIGH'
            case 'my-assigned':
                return arg.assignedTo === 'current_moderator'
            default:
                return true
        }
    })

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'FLAGGED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

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

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return 'text-red-600'
            case 'MEDIUM':
                return 'text-yellow-600'
            case 'LOW':
                return 'text-green-600'
            default:
                return 'text-gray-600'
        }
    }

    const handleModerationAction = async (argumentId: number, action: string, notes: string = '') => {
        console.log(`${action} argument ${argumentId} with notes: ${notes}`)
        // TODO: Implement API call
        setIsModalOpen(false)
        setSelectedArgument(null)
        setModerationNote('')
    }

    const openModerationModal = (argument: any) => {
        setSelectedArgument(argument)
        setIsModalOpen(true)
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Vừa xong'
        if (diffInHours < 24) return `${diffInHours} giờ trước`
        return `${Math.floor(diffInHours / 24)} ngày trước`
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
                        📋 Hàng chờ kiểm duyệt
                    </h1>
                    <p className="text-gray-600">
                        Xem xét và kiểm duyệt các luận điểm đang chờ phê duyệt
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng hàng chờ</p>
                                <p className="text-2xl font-bold text-blue-600">{queueStats.total}</p>
                            </div>
                            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-yellow-600">{queueStats.pending}</p>
                            </div>
                            <ClockIcon className="h-8 w-8 text-yellow-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đã flag</p>
                                <p className="text-2xl font-bold text-red-600">{queueStats.flagged}</p>
                            </div>
                            <FlagIcon className="h-8 w-8 text-red-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Của tôi</p>
                                <p className="text-2xl font-bold text-purple-600">{queueStats.myAssigned}</p>
                            </div>
                            <UserIcon className="h-8 w-8 text-purple-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Thời gian chờ</p>
                                <p className="text-2xl font-bold text-orange-600">{queueStats.avgWaitTime}p</p>
                            </div>
                            <ClockIcon className="h-8 w-8 text-orange-600" />
                        </div>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FunnelIcon className="h-5 w-5 mr-2 text-gray-600" />
                            Bộ lọc
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'all', label: 'Tất cả', count: queueStats.total },
                            { id: 'pending', label: 'Chờ duyệt', count: queueStats.pending },
                            { id: 'flagged', label: 'Đã flag', count: queueStats.flagged },
                            { id: 'high-priority', label: 'Ưu tiên cao', count: 6 },
                            { id: 'my-assigned', label: 'Được gán cho tôi', count: queueStats.myAssigned }
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter.id
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.label} ({filter.count})
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Arguments List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-6"
                >
                    {filteredArgumentsData.map((argument) => (
                        <div key={argument.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="text-lg font-semibold text-gray-900">{argument.title}</h4>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getArgumentTypeStyle(argument.argumentType)}`}>
                                            {argument.argumentType === 'SUPPORT' ? 'Ủng hộ' :
                                                argument.argumentType === 'OPPOSE' ? 'Phản đối' : 'Trung lập'}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(argument.status)}`}>
                                            {argument.status === 'PENDING' ? 'Chờ duyệt' : 'Đã flag'}
                                        </span>
                                        {argument.priority === 'HIGH' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                                Ưu tiên cao
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Chủ đề: {argument.thread.title}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Chờ {argument.waitTime} phút</p>
                                    <p className="text-xs text-gray-400">{formatTimeAgo(argument.createdAt)}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-4">
                                <p className="text-gray-700 line-clamp-3 mb-3">
                                    {argument.content}
                                </p>

                                {/* Author info */}
                                <div className="flex items-center space-x-4 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {argument.author.avatar}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{argument.author.name}</p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-gray-500">{argument.author.role}</span>
                                                <div className="flex items-center">
                                                    <StarIcon className="h-3 w-3 text-yellow-500 mr-1" />
                                                    <span className="text-xs text-gray-500">{argument.author.reputation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>📝 {argument.wordCount} từ</span>
                                        <span>📚 {argument.sources.length} nguồn</span>
                                        <span>🔗 {argument.relatedArguments} liên quan</span>
                                    </div>
                                </div>

                                {/* Flags */}
                                {argument.flags.length > 0 && (
                                    <div className="mb-3">
                                        <div className="flex flex-wrap gap-2">
                                            {argument.flags.map((flag, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <FlagIcon className="h-3 w-3 mr-1" />
                                                    {flag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-3">
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
                                        onClick={() => openModerationModal(argument)}
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
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => openModerationModal(argument)}
                                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    Xem chi tiết
                                </motion.button>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Modal for detailed moderation */}
                <AnimatePresence>
                    {isModalOpen && selectedArgument && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Chi tiết luận điểm
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">{selectedArgument.title}</h4>
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedArgument.content}</p>
                                        </div>

                                        {selectedArgument.sources.length > 0 && (
                                            <div>
                                                <h5 className="font-medium text-gray-900 mb-2">Nguồn tham khảo:</h5>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {selectedArgument.sources.map((source: string, index: number) => (
                                                        <li key={index} className="text-gray-700">{source}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ghi chú kiểm duyệt
                                            </label>
                                            <textarea
                                                value={moderationNote}
                                                onChange={(e) => setModerationNote(e.target.value)}
                                                placeholder="Nhập ghi chú cho quyết định kiểm duyệt..."
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={() => handleModerationAction(selectedArgument.id, 'APPROVE', moderationNote)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Duyệt
                                    </button>
                                    <button
                                        onClick={() => handleModerationAction(selectedArgument.id, 'REJECT', moderationNote)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Từ chối
                                    </button>
                                    <button
                                        onClick={() => handleModerationAction(selectedArgument.id, 'FLAG', moderationNote)}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                    >
                                        Flag
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ModerationQueuePage
